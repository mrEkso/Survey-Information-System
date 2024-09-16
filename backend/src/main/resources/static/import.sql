INSERT INTO `users` (`id`, `username`, `email`, `password`, `token`, `role`)
VALUES (unhex(replace(uuid(), '-', '')), 'baron', 'baroniusokay@gmail.com',
        '$2a$10$EfPJyzhtoYfnu/c9kpL1vuyFIIxue.E1dDYMkHFwptbKSQ4iWiBYC',
        '***REMOVED_JWT_TOKEN***',
        1);
SET @user_id = (SELECT id
                FROM `users`
                WHERE email = 'baroniusokay@gmail.com');
INSERT INTO `surveys` (`id`, `created_at`, `open`, `subtitle`, `title`, `user_id`)
VALUES (unhex(replace(uuid(), '-', '')), NULL, 0, 'test', 'test', @user_id),
       (unhex(replace(uuid(), '-', '')), NULL, 0, 'subtitle', 'title', @user_id),
       (unhex(replace(uuid(), '-', '')), NULL, 0, 'subtitle', 'title', @user_id),
       (unhex(replace(uuid(), '-', '')), NULL, 0, 'subtitle', 'title', @user_id),
       (unhex(replace(uuid(), '-', '')), NULL, 0, 'subtitle', 'title', @user_id);
