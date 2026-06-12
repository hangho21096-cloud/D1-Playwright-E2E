---
name: create-tc
description: Creates detailed Test Cases from Viewpoints
---

# Create Test Cases Skill

1. Use `viewpoint.csv` and requirements.
2. Generate detailed, step-by-step test cases (phù hợp cho cả manual test và automation).
3. Output to `.qa/manual-tests/test-cases.csv` (hoặc `.md`).

## Template Format
Khi sinh ra Test Cases, Agent bắt buộc phải tuân thủ cấu trúc sau (nếu xuất file CSV, các Header tương ứng là các cột; nếu xuất file Markdown, dùng định dạng bảng hoặc các Heading):

- **Test Case ID:** (VD: TC-001, TC-002)
- **Category:** (Functional, Edge Case, Error Handling)
- **Title / Mục tiêu test:** Mô tả ngắn gọn.
- **Pre-conditions (Điều kiện tiên quyết):** Trạng thái trước khi test (VD: Đã đăng nhập).
- **Test Steps (Các bước thực hiện):** Trình bày rõ ràng từng thao tác (1. Nhấn nút A, 2. Nhập chữ B).
- **Expected Results (Kết quả mong đợi):** Điều gì phải xảy ra để pass.
- **Actual Results (Kết quả thực tế):** (Để trống cho QA điền khi test manual).
- **Status:** (Để trống hoặc `[ ]` cho QA điền Pass/Fail).
