// @ts-nocheck
import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';

export interface EmailConfig {
    user: string;
    pass: string; // App password
    host: string;
    port: number;
    secure: boolean;
}

/**
 * Connects to the IMAP mailbox, waits for the verification email, and extracts the magic link.
 * Searches programmatically for unread emails related to IVY.
 * @param config IMAP connection configuration
 * @param timeoutMs Maximum wait time (default 45 seconds)
 */
export async function getMagicLinkFromEmail(
    config: EmailConfig,
    timeoutMs: number = 45000,
    targetEmail?: string
): Promise<string> {
    const client = new ImapFlow({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: {
            user: config.user,
            pass: config.pass
        },
        logger: false
    });

    await client.connect();

    let magicLink = '';
    const startTime = Date.now();

    try {
        const lock = await client.getMailboxLock('INBOX');
        try {
            while (Date.now() - startTime < timeoutMs) {
                // Search for all UNREAD (unseen) messages
                const messages = await client.search({ unseen: true });

                if (messages.length > 0) {
                    // Check only the last 10 most recent unread messages to avoid slow fetching
                    const startIndex = Math.max(0, messages.length - 10);
                    for (let i = messages.length - 1; i >= startIndex; i--) {
                        const latestUid = messages[i];
                        const message = await client.fetchOne(latestUid, { source: true });
                        if (!message || !message.source) {
                            continue;
                        }
                        const parsed = await simpleParser(message.source);
                        
                        const subject = (parsed.subject || '').toLowerCase();
                        const senderText = (parsed.from ? parsed.from.text : '').toLowerCase();

                        // Match emails with subject containing "welcome to ivy" or "verify" or sender from "ivy"
                        let isMatch = subject.includes('welcome to ivy') || 
                                      subject.includes('verify') || 
                                      subject.includes('magic link') ||
                                      senderText.includes('ivy');

                        if (isMatch && targetEmail) {
                            const bodyText = (parsed.text || parsed.html || '').toLowerCase();
                            const toText = (parsed.to ? JSON.stringify(parsed.to) : '').toLowerCase();
                            const subjectText = subject.toLowerCase();
                            const matchesTarget = toText.includes(targetEmail.toLowerCase()) || 
                                                  bodyText.includes(targetEmail.toLowerCase()) ||
                                                  subjectText.includes(targetEmail.toLowerCase());
                            if (!matchesTarget) {
                                isMatch = false;
                            }
                        }

                        if (isMatch) {
                            const bodyText = parsed.text || parsed.html || '';
                            
                            // Mark the matched email as read (seen) so it won't be processed again
                            await client.messageFlagsAdd(latestUid, ['\\Seen']);

                            // Extract URL from body text
                            const urlRegex = /https:\/\/[^\s"'<>]+/g;
                            const matches = bodyText.match(urlRegex) || [];
                            
                            // Find the registration/verification magic link URL
                            const loginLink = matches.find(url => 
                                url.includes('auth/login') || 
                                url.includes('token') || 
                                url.includes('magic') ||
                                url.includes('click') ||
                                url.includes('verify')
                            );
                            
                            if (loginLink) {
                                magicLink = loginLink;
                                break;
                            }
                        }
                    }
                    if (magicLink) break;
                }
                
                // Wait 3 seconds before polling Gmail again
                await new Promise<void>(resolve => setTimeout(() => resolve(), 3000));
            }
        } finally {
            lock.release();
        }
    } finally {
        await client.logout();
    }

    if (!magicLink) {
        throw new Error(`Verification magic link email not found within ${timeoutMs / 1000}s`);
    }

    return magicLink;
}
