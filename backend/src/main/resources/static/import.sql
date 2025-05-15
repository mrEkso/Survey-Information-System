INSERT INTO `users` (
                `id`,
                `nickname`,
                `email`,
                `password`,
                `token`,
                `role`
        )
VALUES (
                unhex('11111111111111111111111111111111'),
                'baron',
                'bar@gmail.com',
                '$2a$10$EfPJyzhtoYfnu/c9kpL1vuyFIIxue.E1dDYMkHFwptbKSQ4iWiBYC',
                '***REMOVED_JWT_TOKEN***',
                1
        );
INSERT INTO `users` (
                `id`,
                `nickname`,
                `email`,
                `password`,
                `token`,
                `role`
        )
VALUES (
                unhex('22222222222222222222222222222222'),
                'test',
                'test@gmail.com',
                '$2a$10$JFdzaFBZtffT548tqHsZR.Cvje5BhA86h86J5.jN/0YIuvSlExnJi',
                '***REMOVED_JWT_TOKEN***',
                1
        );
SET @user_id = unhex('11111111111111111111111111111111');
-- Test surveys with options
-- Survey 1: Логістичні потреби
INSERT INTO surveys (
                id,
                created_at,
                open,
                subtitle,
                title,
                user_id,
                image_url,
                survey_type
        )
VALUES (
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
                NOW(),
                1,
                'Які логістичні потреби є найбільш критичними для вашого підрозділу?',
                'Логістичні потреби підрозділу',
                @user_id,
                'logistics.jpg',
                'SINGLE_CHOICE'
        );
INSERT INTO survey_options (id, survey_id, name, votes)
VALUES (
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
                'Транспортні засоби',
                0
        ),
        (
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaac'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
                'Паливо',
                0
        ),
        (
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaad'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
                'Ремонт техніки',
                0
        );
-- Survey 2: Медичне забезпечення
INSERT INTO surveys (
                id,
                created_at,
                open,
                subtitle,
                title,
                user_id,
                image_url,
                survey_type
        )
VALUES (
                unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'),
                NOW(),
                1,
                'Які медичні засоби та обладнання потрібні найбільш терміново?',
                'Медичне забезпечення',
                @user_id,
                'medicine.jpg',
                'MULTIPLE_CHOICE'
        );
INSERT INTO survey_options (id, survey_id, name, votes)
VALUES (
                unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbc'),
                unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'),
                'Аптечки першої допомоги',
                0
        ),
        (
                unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbd'),
                unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'),
                'Турнікети',
                0
        ),
        (
                unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbe'),
                unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'),
                'Медичні носилки',
                0
        );
-- Survey 3: Засоби зв'язку
INSERT INTO surveys (
                id,
                created_at,
                open,
                subtitle,
                title,
                user_id,
                image_url,
                survey_type
        )
VALUES (
                unhex('cccccccccccccccccccccccccccccccc'),
                NOW(),
                1,
                'Які засоби зв`язку потрібні для ефективної комунікації?',
                'Засоби зв`язку',
                @user_id,
                'communication.jpg',
                'SINGLE_CHOICE'
        );
INSERT INTO survey_options (id, survey_id, name, votes)
VALUES (
                unhex('cccccccccccccccccccccccccccccccb'),
                unhex('cccccccccccccccccccccccccccccccc'),
                'Радіостанції',
                0
        ),
        (
                unhex('cccccccccccccccccccccccccccccccd'),
                unhex('cccccccccccccccccccccccccccccccc'),
                'Супутникові телефони',
                0
        ),
        (
                unhex('ccccccccccccccccccccccccccccccce'),
                unhex('cccccccccccccccccccccccccccccccc'),
                'Тактичні рації',
                0
        );
-- Survey 4: Захист та безпека
INSERT INTO surveys (
                id,
                created_at,
                open,
                subtitle,
                title,
                user_id,
                image_url,
                survey_type,
                min_rating,
                max_rating
        )
VALUES (
                unhex('ddddddddddddddddddddddddddddddd1'),
                NOW(),
                1,
                'Оцініть важливість кожного елементу захисту за шкалою від 1 до 5',
                'Захист та безпека',
                @user_id,
                'security.jpg',
                'RATING_SCALE',
                1,
                5
        );
INSERT INTO survey_options (id, survey_id, name, votes)
VALUES (
                unhex('ddddddddddddddddddddddddddddddde'),
                unhex('ddddddddddddddddddddddddddddddd1'),
                'Бронежилети',
                0
        ),
        (
                unhex('dddddddddddddddddddddddddddddddf'),
                unhex('ddddddddddddddddddddddddddddddd1'),
                'Шоломи',
                0
        ),
        (
                unhex('ddddddddddddddddddddddddddddddff'),
                unhex('ddddddddddddddddddddddddddddddd1'),
                'Захист для техніки',
                0
        );
-- Survey 5: Харчування та побут
INSERT INTO surveys (
                id,
                created_at,
                open,
                subtitle,
                title,
                user_id,
                image_url,
                survey_type
        )
VALUES (
                unhex('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'),
                NOW(),
                1,
                'Розташуйте в порядку важливості наступні потреби',
                'Харчування та побут',
                @user_id,
                'food.jpg',
                'RANKING'
        );
INSERT INTO survey_options (id, survey_id, name, votes)
VALUES (
                unhex('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeef'),
                unhex('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'),
                'Сухі пайки',
                0
        ),
        (
                unhex('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeea'),
                unhex('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'),
                'Польові кухні',
                0
        ),
        (
                unhex('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeb'),
                unhex('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'),
                'Спальні мішки',
                0
        );
-- Survey 6: Технічне обладнання
INSERT INTO surveys (
                id,
                created_at,
                open,
                subtitle,
                title,
                user_id,
                image_url,
                survey_type,
                matrix_columns
        )
VALUES (
                unhex('ffffffffffffffffffffffffffffffff'),
                NOW(),
                1,
                'Оцініть важливість технічного обладнання для різних завдань',
                'Технічне обладнання',
                @user_id,
                'equipment.jpg',
                'MATRIX',
                '["Дуже важливо","Важливо","Нейтрально","Не важливо","Зовсім не важливо"]'
        );
INSERT INTO survey_options (id, survey_id, name, votes)
VALUES (
                unhex('fffffffffffffffffffffffffffffff1'),
                unhex('ffffffffffffffffffffffffffffffff'),
                'Нічні приціли',
                0
        ),
        (
                unhex('fffffffffffffffffffffffffffffff2'),
                unhex('ffffffffffffffffffffffffffffffff'),
                'Тепловізори',
                0
        ),
        (
                unhex('fffffffffffffffffffffffffffffff3'),
                unhex('ffffffffffffffffffffffffffffffff'),
                'Дрони',
                0
        );
-- Survey 7: Зимове спорядження
INSERT INTO surveys (
                id,
                created_at,
                open,
                subtitle,
                title,
                user_id,
                image_url,
                views
        )
VALUES (
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa00'),
                NOW(),
                1,
                'Яке зимове спорядження потрібне для комфортної служби?',
                'Зимове спорядження',
                @user_id,
                'winter.jpg',
                123
        );
INSERT INTO survey_options (id, survey_id, name, votes)
VALUES (
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa01'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa00'),
                'Термобілизна',
                0
        ),
        (
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa02'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa00'),
                'Зимові чоботи',
                0
        ),
        (
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa03'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa00'),
                'Обігрівачі',
                0
        );
-- Survey 8: Навчання та підготовка
INSERT INTO surveys (
                id,
                created_at,
                open,
                subtitle,
                title,
                user_id,
                image_url
        )
VALUES (
                unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb00'),
                NOW(),
                1,
                'Які навчальні програми та тренування потрібні для підвищення кваліфікації?',
                'Навчання та підготовка',
                @user_id,
                'training.jpg'
        );
INSERT INTO survey_options (id, survey_id, name, votes)
VALUES (
                unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb01'),
                unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb00'),
                'Тактична медицина',
                0
        ),
        (
                unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb02'),
                unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb00'),
                'Робота з дронами',
                0
        ),
        (
                unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb03'),
                unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb00'),
                'Тактична підготовка',
                0
        );
-- Survey 9: Психологічна підтримка
INSERT INTO surveys (
                id,
                created_at,
                open,
                subtitle,
                title,
                user_id,
                image_url
        )
VALUES (
                unhex('cccccccccccccccccccccccccccccc00'),
                NOW(),
                1,
                'Які форми психологічної підтримки є найбільш ефективними?',
                'Психологічна підтримка',
                @user_id,
                'psychology.jpg'
        );
INSERT INTO survey_options (id, survey_id, name, votes)
VALUES (
                unhex('cccccccccccccccccccccccccccccc01'),
                unhex('cccccccccccccccccccccccccccccc00'),
                'Індивідуальні консультації',
                0
        ),
        (
                unhex('cccccccccccccccccccccccccccccc02'),
                unhex('cccccccccccccccccccccccccccccc00'),
                'Групові тренінги',
                0
        ),
        (
                unhex('cccccccccccccccccccccccccccccc03'),
                unhex('cccccccccccccccccccccccccccccc00'),
                'Реабілітаційні програми',
                0
        );
-- Survey 10: Інформаційна безпека
INSERT INTO surveys (
                id,
                created_at,
                open,
                subtitle,
                title,
                user_id,
                image_url
        )
VALUES (
                unhex('dddddddddddddddddddddddddddddddd'),
                NOW(),
                1,
                'Які засоби інформаційної безпеки потрібні для захисту даних?',
                'Інформаційна безпека',
                @user_id,
                'infosec.jpg'
        );
INSERT INTO survey_options (id, survey_id, name, votes)
VALUES (
                unhex('ddddddddddddddddddddddddddddddd1'),
                unhex('dddddddddddddddddddddddddddddddd'),
                'Захищені канали зв`язку',
                0
        ),
        (
                unhex('ddddddddddddddddddddddddddddddd2'),
                unhex('dddddddddddddddddddddddddddddddd'),
                'Шифрування даних',
                0
        ),
        (
                unhex('ddddddddddddddddddddddddddddddd3'),
                unhex('dddddddddddddddddddddddddddddddd'),
                'Навчання з кібербезпеки',
                0
        );
-- МАССОВОЕ ДОБАВЛЕНИЕ ТЕСТОВЫХ ПОЛЬЗОВАТЕЛЕЙ (20 новых пользователей)
INSERT INTO `users` (
                `id`,
                `nickname`,
                `email`,
                `password`,
                `token`,
                `role`
        )
VALUES (
                unhex('c1111111111111111111111111111111'),
                'soldier1',
                'soldier1@example.com',
                '$2a$10$7Qw1Qw1Qw1Qw1Qw1Qw1QwOQw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Q',
                '***REMOVED_JWT_TOKEN***',
                2
        );
INSERT INTO `users` (
                `id`,
                `nickname`,
                `email`,
                `password`,
                `token`,
                `role`
        )
VALUES (
                unhex('c2222222222222222222222222222222'),
                'soldier2',
                'soldier2@example.com',
                '$2a$10$7Qw1Qw1Qw1Qw1Qw1Qw1QwOQw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Q',
                '***REMOVED_JWT_TOKEN***',
                2
        );
INSERT INTO `users` (
                `id`,
                `nickname`,
                `email`,
                `password`,
                `token`,
                `role`
        )
VALUES (
                unhex('c3333333333333333333333333333333'),
                'soldier3',
                'soldier3@example.com',
                '$2a$10$7Qw1Qw1Qw1Qw1Qw1Qw1QwOQw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Q',
                '***REMOVED_JWT_TOKEN***',
                2
        );
INSERT INTO `users` (
                `id`,
                `nickname`,
                `email`,
                `password`,
                `token`,
                `role`
        )
VALUES (
                unhex('c4444444444444444444444444444444'),
                'soldier4',
                'soldier4@example.com',
                '$2a$10$7Qw1Qw1Qw1Qw1Qw1Qw1QwOQw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Q',
                '***REMOVED_JWT_TOKEN***',
                2
        );
INSERT INTO `users` (
                `id`,
                `nickname`,
                `email`,
                `password`,
                `token`,
                `role`
        )
VALUES (
                unhex('c5555555555555555555555555555555'),
                'soldier5',
                'soldier5@example.com',
                '$2a$10$7Qw1Qw1Qw1Qw1Qw1Qw1QwOQw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Q',
                '***REMOVED_JWT_TOKEN***',
                2
        );
INSERT INTO `users` (
                `id`,
                `nickname`,
                `email`,
                `password`,
                `token`,
                `role`
        )
VALUES (
                unhex('c6666666666666666666666666666666'),
                'soldier6',
                'soldier6@example.com',
                '$2a$10$7Qw1Qw1Qw1Qw1Qw1Qw1QwOQw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Q',
                '***REMOVED_JWT_TOKEN***',
                2
        );
INSERT INTO `users` (
                `id`,
                `nickname`,
                `email`,
                `password`,
                `token`,
                `role`
        )
VALUES (
                unhex('c7777777777777777777777777777777'),
                'soldier7',
                'soldier7@example.com',
                '$2a$10$7Qw1Qw1Qw1Qw1Qw1Qw1QwOQw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Q',
                '***REMOVED_JWT_TOKEN***',
                2
        );
INSERT INTO `users` (
                `id`,
                `nickname`,
                `email`,
                `password`,
                `token`,
                `role`
        )
VALUES (
                unhex('c8888888888888888888888888888888'),
                'soldier8',
                'soldier8@example.com',
                '$2a$10$7Qw1Qw1Qw1Qw1Qw1Qw1QwOQw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Q',
                '***REMOVED_JWT_TOKEN***',
                2
        );
INSERT INTO `users` (
                `id`,
                `nickname`,
                `email`,
                `password`,
                `token`,
                `role`
        )
VALUES (
                unhex('c9999999999999999999999999999999'),
                'soldier9',
                'soldier9@example.com',
                '$2a$10$7Qw1Qw1Qw1Qw1Qw1Qw1QwOQw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Q',
                '***REMOVED_JWT_TOKEN***',
                2
        );
INSERT INTO `users` (
                `id`,
                `nickname`,
                `email`,
                `password`,
                `token`,
                `role`
        )
VALUES (
                unhex('caaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
                'soldier10',
                'soldier10@example.com',
                '$2a$10$7Qw1Qw1Qw1Qw1Qw1Qw1QwOQw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Q',
                '***REMOVED_JWT_TOKEN***',
                2
        );
INSERT INTO `users` (
                `id`,
                `nickname`,
                `email`,
                `password`,
                `token`,
                `role`
        )
VALUES (
                unhex('cbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'),
                'soldier11',
                'soldier11@example.com',
                '$2a$10$7Qw1Qw1Qw1Qw1Qw1Qw1QwOQw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Q',
                '***REMOVED_JWT_TOKEN***',
                2
        );
INSERT INTO `users` (
                `id`,
                `nickname`,
                `email`,
                `password`,
                `token`,
                `role`
        )
VALUES (
                unhex('ccccccccccccccccccccccccccccccc'),
                'soldier12',
                'soldier12@example.com',
                '$2a$10$7Qw1Qw1Qw1Qw1Qw1Qw1QwOQw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Q',
                '***REMOVED_JWT_TOKEN***',
                2
        );
INSERT INTO `users` (
                `id`,
                `nickname`,
                `email`,
                `password`,
                `token`,
                `role`
        )
VALUES (
                unhex('cddddddddddddddddddddddddddddddd'),
                'soldier13',
                'soldier13@example.com',
                '$2a$10$7Qw1Qw1Qw1Qw1Qw1Qw1QwOQw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Q',
                '***REMOVED_JWT_TOKEN***',
                2
        );
INSERT INTO `users` (
                `id`,
                `nickname`,
                `email`,
                `password`,
                `token`,
                `role`
        )
VALUES (
                unhex('ceeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'),
                'soldier14',
                'soldier14@example.com',
                '$2a$10$7Qw1Qw1Qw1Qw1Qw1Qw1QwOQw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Q',
                '***REMOVED_JWT_TOKEN***',
                2
        );
INSERT INTO `users` (
                `id`,
                `nickname`,
                `email`,
                `password`,
                `token`,
                `role`
        )
VALUES (
                unhex('cfffffffffffffffffffffffffffffff'),
                'soldier15',
                'soldier15@example.com',
                '$2a$10$7Qw1Qw1Qw1Qw1Qw1Qw1QwOQw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Q',
                '***REMOVED_JWT_TOKEN***',
                2
        );
INSERT INTO `users` (
                `id`,
                `nickname`,
                `email`,
                `password`,
                `token`,
                `role`
        )
VALUES (
                unhex('d1111111111111111111111111111111'),
                'soldier16',
                'soldier16@example.com',
                '$2a$10$7Qw1Qw1Qw1Qw1Qw1Qw1QwOQw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Q',
                '***REMOVED_JWT_TOKEN***',
                2
        );
INSERT INTO `users` (
                `id`,
                `nickname`,
                `email`,
                `password`,
                `token`,
                `role`
        )
VALUES (
                unhex('d2222222222222222222222222222222'),
                'soldier17',
                'soldier17@example.com',
                '$2a$10$7Qw1Qw1Qw1Qw1Qw1Qw1QwOQw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Q',
                '***REMOVED_JWT_TOKEN***',
                2
        );
INSERT INTO `users` (
                `id`,
                `nickname`,
                `email`,
                `password`,
                `token`,
                `role`
        )
VALUES (
                unhex('d3333333333333333333333333333333'),
                'soldier18',
                'soldier18@example.com',
                '$2a$10$7Qw1Qw1Qw1Qw1Qw1Qw1QwOQw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Q',
                '***REMOVED_JWT_TOKEN***',
                2
        );
INSERT INTO `users` (
                `id`,
                `nickname`,
                `email`,
                `password`,
                `token`,
                `role`
        )
VALUES (
                unhex('d4444444444444444444444444444444'),
                'soldier19',
                'soldier19@example.com',
                '$2a$10$7Qw1Qw1Qw1Qw1Qw1Qw1QwOQw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Q',
                '***REMOVED_JWT_TOKEN***',
                2
        );
INSERT INTO `users` (
                `id`,
                `nickname`,
                `email`,
                `password`,
                `token`,
                `role`
        )
VALUES (
                unhex('d5555555555555555555555555555555'),
                'soldier20',
                'soldier20@example.com',
                '$2a$10$7Qw1Qw1Qw1Qw1Qw1Qw1QwOQw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Q',
                '***REMOVED_JWT_TOKEN***',
                2
        );
-- МАССОВЕ ДОДАВАННЯ ГОЛОСІВ ВІД НОВИХ КОРИСТУВАЧІВ (розподілені між варіантами "Термобілизна", "Зимові чоботи", "Обігрівачі")
INSERT INTO votes (
                id,
                user_id,
                survey_id,
                survey_option_id,
                created_at
        )
VALUES (
                unhex('a1111111111111111111111111111111'),
                unhex('c1111111111111111111111111111111'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa00'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa01'),
                DATE_SUB(NOW(), INTERVAL 10 DAY)
        );
INSERT INTO votes (
                id,
                user_id,
                survey_id,
                survey_option_id,
                created_at
        )
VALUES (
                unhex('a2222222222222222222222222222222'),
                unhex('c2222222222222222222222222222222'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa00'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa01'),
                DATE_SUB(NOW(), INTERVAL 9 DAY)
        );
INSERT INTO votes (
                id,
                user_id,
                survey_id,
                survey_option_id,
                created_at
        )
VALUES (
                unhex('a3333333333333333333333333333333'),
                unhex('c4444444444444444444444444444444'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa00'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa01'),
                DATE_SUB(NOW(), INTERVAL 8 DAY)
        );
INSERT INTO votes (
                id,
                user_id,
                survey_id,
                survey_option_id,
                created_at
        )
VALUES (
                unhex('a4444444444444444444444444444444'),
                unhex('c6666666666666666666666666666666'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa00'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa01'),
                DATE_SUB(NOW(), INTERVAL 7 DAY)
        );
INSERT INTO votes (
                id,
                user_id,
                survey_id,
                survey_option_id,
                created_at
        )
VALUES (
                unhex('a5555555555555555555555555555555'),
                unhex('c7777777777777777777777777777777'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa00'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa01'),
                DATE_SUB(NOW(), INTERVAL 6 DAY)
        );
INSERT INTO votes (
                id,
                user_id,
                survey_id,
                survey_option_id,
                created_at
        )
VALUES (
                unhex('a6666666666666666666666666666666'),
                unhex('c9999999999999999999999999999999'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa00'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa01'),
                DATE_SUB(NOW(), INTERVAL 5 DAY)
        );
INSERT INTO votes (
                id,
                user_id,
                survey_id,
                survey_option_id,
                created_at
        )
VALUES (
                unhex('a7777777777777777777777777777777'),
                unhex('cbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa00'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa01'),
                DATE_SUB(NOW(), INTERVAL 4 DAY)
        );
INSERT INTO votes (
                id,
                user_id,
                survey_id,
                survey_option_id,
                created_at
        )
VALUES (
                unhex('a8888888888888888888888888888888'),
                unhex('cddddddddddddddddddddddddddddddd'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa00'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa01'),
                DATE_SUB(NOW(), INTERVAL 3 DAY)
        );
INSERT INTO votes (
                id,
                user_id,
                survey_id,
                survey_option_id,
                created_at
        )
VALUES (
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
                unhex('d2222222222222222222222222222222'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa00'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa01'),
                DATE_SUB(NOW(), INTERVAL 1 DAY)
        );
INSERT INTO votes (
                id,
                user_id,
                survey_id,
                survey_option_id,
                created_at
        )
VALUES (
                unhex('abbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'),
                unhex('d3333333333333333333333333333333'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa00'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa01'),
                NOW()
        );
INSERT INTO votes (
                id,
                user_id,
                survey_id,
                survey_option_id,
                created_at
        )
VALUES (
                unhex('b1111111111111111111111111111111'),
                unhex('c3333333333333333333333333333333'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa00'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa02'),
                DATE_SUB(NOW(), INTERVAL 15 DAY)
        );
-- 8 голосов за Обігрівачі
INSERT INTO votes (
                id,
                user_id,
                survey_id,
                survey_option_id,
                created_at
        )
VALUES (
                unhex('e1111111111111111111111111111111'),
                unhex('ccccccccccccccccccccccccccccccc'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa00'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa03'),
                DATE_SUB(NOW(), INTERVAL 10 DAY)
        );
INSERT INTO votes (
                id,
                user_id,
                survey_id,
                survey_option_id,
                created_at
        )
VALUES (
                unhex('e3333333333333333333333333333333'),
                unhex('ceeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa00'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa03'),
                DATE_SUB(NOW(), INTERVAL 8 DAY)
        );
INSERT INTO votes (
                id,
                user_id,
                survey_id,
                survey_option_id,
                created_at
        )
VALUES (
                unhex('e4444444444444444444444444444444'),
                unhex('cfffffffffffffffffffffffffffffff'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa00'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa03'),
                DATE_SUB(NOW(), INTERVAL 7 DAY)
        );
INSERT INTO votes (
                id,
                user_id,
                survey_id,
                survey_option_id,
                created_at
        )
VALUES (
                unhex('e5555555555555555555555555555555'),
                unhex('d1111111111111111111111111111111'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa00'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa03'),
                DATE_SUB(NOW(), INTERVAL 6 DAY)
        );
INSERT INTO votes (
                id,
                user_id,
                survey_id,
                survey_option_id,
                created_at
        )
VALUES (
                unhex('e7777777777777777777777777777777'),
                unhex('d4444444444444444444444444444444'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa00'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa03'),
                DATE_SUB(NOW(), INTERVAL 4 DAY)
        );
INSERT INTO votes (
                id,
                user_id,
                survey_id,
                survey_option_id,
                created_at
        )
VALUES (
                unhex('e8888888888888888888888888888888'),
                unhex('d5555555555555555555555555555555'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa00'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa03'),
                DATE_SUB(NOW(), INTERVAL 3 DAY)
        );
-- Обновляємо підрахунки голосів в survey_options відповідно доданих голосів
UPDATE survey_options
SET votes = 10
WHERE id = unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa01');
-- Термобілизна (10)
UPDATE survey_options
SET votes = 1
WHERE id = unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa02');
-- Зимові чоботи (1)
UPDATE survey_options
SET votes = 6
WHERE id = unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa03');
-- Обігрівачі (6)
-- Тестове опитування від test@gmail.com
INSERT INTO surveys (
                id,
                created_at,
                open,
                subtitle,
                title,
                user_id,
                image_url
        )
VALUES (
                unhex('feedfeedfeedfeedfeedfeedfeedfeed'),
                NOW(),
                1,
                'Це тестове опитування для перевірки системи',
                'Тестове опитування',
                unhex('22222222222222222222222222222222'),
                NULL
        );
INSERT INTO survey_options (id, survey_id, name, votes)
VALUES (
                unhex('feedfeedfeedfeedfeedfeedfeedfea1'),
                unhex('feedfeedfeedfeedfeedfeedfeedfeed'),
                'Варіант 1',
                0
        ),
        (
                unhex('feedfeedfeedfeedfeedfeedfeedfea2'),
                unhex('feedfeedfeedfeedfeedfeedfeedfeed'),
                'Варіант 2',
                0
        ),
        (
                unhex('feedfeedfeedfeedfeedfeedfeedfea3'),
                unhex('feedfeedfeedfeedfeedfeedfeedfeed'),
                'Варіант 3',
                0
        );
-- END тестовий опитування
-- МАССОВЕ ДОДАВАННЯ ГОЛОСІВ ДЛЯ ІНШИХ ОПИТУВАНЬ
-- Голоси для "Логістичні потреби" (Survey 1)
INSERT INTO votes (
                id,
                user_id,
                survey_id,
                survey_option_id,
                created_at
        )
VALUES (
                unhex('f1111111111111111111111111111111'),
                unhex('c1111111111111111111111111111111'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab'),
                DATE_SUB(NOW(), INTERVAL 5 DAY)
        ),
        (
                unhex('f2222222222222222222222222222222'),
                unhex('c2222222222222222222222222222222'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab'),
                DATE_SUB(NOW(), INTERVAL 4 DAY)
        ),
        (
                unhex('f3333333333333333333333333333333'),
                unhex('c4444444444444444444444444444444'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaac'),
                DATE_SUB(NOW(), INTERVAL 3 DAY)
        ),
        (
                unhex('f4444444444444444444444444444444'),
                unhex('c6666666666666666666666666666666'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
                unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaad'),
                DATE_SUB(NOW(), INTERVAL 2 DAY)
        );
UPDATE survey_options
SET votes = 2
WHERE id = unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab');
-- Транспортні засоби
UPDATE survey_options
SET votes = 1
WHERE id = unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaac');
-- Паливо
UPDATE survey_options
SET votes = 1
WHERE id = unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaad');
-- Ремонт техніки
-- Голоси для "Медичне забезпечення" (Survey 2)
INSERT INTO votes (
                id,
                user_id,
                survey_id,
                survey_option_id,
                created_at
        )
VALUES (
                unhex('f5555555555555555555555555555555'),
                unhex('c5555555555555555555555555555555'),
                unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'),
                unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbc'),
                DATE_SUB(NOW(), INTERVAL 6 DAY)
        ),
        (
                unhex('f6666666666666666666666666666666'),
                unhex('c6666666666666666666666666666666'),
                unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'),
                unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbd'),
                DATE_SUB(NOW(), INTERVAL 5 DAY)
        ),
        (
                unhex('f7777777777777777777777777777777'),
                unhex('c7777777777777777777777777777777'),
                unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'),
                unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbd'),
                DATE_SUB(NOW(), INTERVAL 4 DAY)
        ),
        (
                unhex('f8888888888888888888888888888888'),
                unhex('c8888888888888888888888888888888'),
                unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'),
                unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbe'),
                DATE_SUB(NOW(), INTERVAL 3 DAY)
        ),
        (
                unhex('f9999999999999999999999999999999'),
                unhex('c9999999999999999999999999999999'),
                unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'),
                unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbe'),
                DATE_SUB(NOW(), INTERVAL 2 DAY)
        );
UPDATE survey_options
SET votes = 1
WHERE id = unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbc');
-- Аптечки першої допомоги
UPDATE survey_options
SET votes = 2
WHERE id = unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbd');
-- Турнікети
UPDATE survey_options
SET votes = 2
WHERE id = unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbe');
-- Медичні носилки
-- Голоси для "Засоби зв'язку" (Survey 3)
INSERT INTO votes (
                id,
                user_id,
                survey_id,
                survey_option_id,
                created_at
        )
VALUES (
                unhex('faaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
                unhex('caaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
                unhex('cccccccccccccccccccccccccccccccc'),
                unhex('cccccccccccccccccccccccccccccccb'),
                DATE_SUB(NOW(), INTERVAL 7 DAY)
        ),
        (
                unhex('fbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'),
                unhex('cbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'),
                unhex('cccccccccccccccccccccccccccccccc'),
                unhex('cccccccccccccccccccccccccccccccb'),
                DATE_SUB(NOW(), INTERVAL 6 DAY)
        ),
        (
                unhex('fccccccccccccccccccccccccccccccc'),
                unhex('ccccccccccccccccccccccccccccccc'),
                unhex('cccccccccccccccccccccccccccccccc'),
                unhex('cccccccccccccccccccccccccccccccd'),
                DATE_SUB(NOW(), INTERVAL 5 DAY)
        ),
        (
                unhex('fdddddddddddddddddddddddddddddd'),
                unhex('cddddddddddddddddddddddddddddddd'),
                unhex('cccccccccccccccccccccccccccccccc'),
                unhex('ccccccccccccccccccccccccccccccce'),
                DATE_SUB(NOW(), INTERVAL 4 DAY)
        ),
        (
                unhex('feeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'),
                unhex('ceeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'),
                unhex('cccccccccccccccccccccccccccccccc'),
                unhex('ccccccccccccccccccccccccccccccce'),
                DATE_SUB(NOW(), INTERVAL 3 DAY)
        ),
        (
                unhex('ffffffffffffffffffffffffffffffff'),
                unhex('cfffffffffffffffffffffffffffffff'),
                unhex('cccccccccccccccccccccccccccccccc'),
                unhex('ccccccccccccccccccccccccccccccce'),
                DATE_SUB(NOW(), INTERVAL 2 DAY)
        );
UPDATE survey_options
SET votes = 2
WHERE id = unhex('cccccccccccccccccccccccccccccccb');
-- Радіостанції
UPDATE survey_options
SET votes = 1
WHERE id = unhex('cccccccccccccccccccccccccccccccd');
-- Супутникові телефони
UPDATE survey_options
SET votes = 3
WHERE id = unhex('ccccccccccccccccccccccccccccccce');
-- Тактичні рації
-- Голоси для "Захист та безпека" (Survey 4)
INSERT INTO votes (
                id,
                user_id,
                survey_id,
                survey_option_id,
                created_at
        )
VALUES (
                unhex('d6666666666666666666666666666666'),
                unhex('d1111111111111111111111111111111'),
                unhex('ddddddddddddddddddddddddddddddd1'),
                unhex('ddddddddddddddddddddddddddddddde'),
                DATE_SUB(NOW(), INTERVAL 8 DAY)
        ),
        (
                unhex('d7777777777777777777777777777777'),
                unhex('d2222222222222222222222222222222'),
                unhex('ddddddddddddddddddddddddddddddd1'),
                unhex('ddddddddddddddddddddddddddddddde'),
                DATE_SUB(NOW(), INTERVAL 7 DAY)
        ),
        (
                unhex('d8888888888888888888888888888888'),
                unhex('d3333333333333333333333333333333'),
                unhex('ddddddddddddddddddddddddddddddd1'),
                unhex('dddddddddddddddddddddddddddddddf'),
                DATE_SUB(NOW(), INTERVAL 6 DAY)
        ),
        (
                unhex('d9999999999999999999999999999999'),
                unhex('d4444444444444444444444444444444'),
                unhex('ddddddddddddddddddddddddddddddd1'),
                unhex('ddddddddddddddddddddddddddddddff'),
                DATE_SUB(NOW(), INTERVAL 5 DAY)
        ),
        (
                unhex('daaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
                unhex('d5555555555555555555555555555555'),
                unhex('ddddddddddddddddddddddddddddddd1'),
                unhex('ddddddddddddddddddddddddddddddff'),
                DATE_SUB(NOW(), INTERVAL 4 DAY)
        );
UPDATE survey_options
SET votes = 2
WHERE id = unhex('ddddddddddddddddddddddddddddddde');
-- Бронежилети
UPDATE survey_options
SET votes = 1
WHERE id = unhex('dddddddddddddddddddddddddddddddf');
-- Шоломи
UPDATE survey_options
SET votes = 2
WHERE id = unhex('ddddddddddddddddddddddddddddddff');
-- Захист для техніки
-- Голоси для "Харчування та побут" (Survey 5)
INSERT INTO votes (
                id,
                user_id,
                survey_id,
                survey_option_id,
                created_at
        )
VALUES (
                unhex('eaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
                unhex('c1111111111111111111111111111111'),
                unhex('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'),
                unhex('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeef'),
                DATE_SUB(NOW(), INTERVAL 9 DAY)
        ),
        (
                unhex('ebbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'),
                unhex('c3333333333333333333333333333333'),
                unhex('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'),
                unhex('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeef'),
                DATE_SUB(NOW(), INTERVAL 8 DAY)
        ),
        (
                unhex('eccccccccccccccccccccccccccccccc'),
                unhex('c5555555555555555555555555555555'),
                unhex('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'),
                unhex('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeea'),
                DATE_SUB(NOW(), INTERVAL 7 DAY)
        ),
        (
                unhex('eddddddddddddddddddddddddddddddd'),
                unhex('c7777777777777777777777777777777'),
                unhex('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'),
                unhex('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeb'),
                DATE_SUB(NOW(), INTERVAL 6 DAY)
        );
UPDATE survey_options
SET votes = 2
WHERE id = unhex('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeef');
-- Сухі пайки
UPDATE survey_options
SET votes = 1
WHERE id = unhex('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeea');
-- Польові кухні
UPDATE survey_options
SET votes = 1
WHERE id = unhex('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeb');
-- Спальні мішки
-- Голоси для "Технічне обладнання" (Survey 6)
INSERT INTO votes (
                id,
                user_id,
                survey_id,
                survey_option_id,
                created_at
        )
VALUES (
                unhex('faaaaaaaaaaaaaaaaaaaaaaaaaaaaa11'),
                unhex('c2222222222222222222222222222222'),
                unhex('ffffffffffffffffffffffffffffffff'),
                unhex('fffffffffffffffffffffffffffffff1'),
                DATE_SUB(NOW(), INTERVAL 10 DAY)
        ),
        (
                unhex('faaaaaaaaaaaaaaaaaaaaaaaaaaaaa22'),
                unhex('c4444444444444444444444444444444'),
                unhex('ffffffffffffffffffffffffffffffff'),
                unhex('fffffffffffffffffffffffffffffff2'),
                DATE_SUB(NOW(), INTERVAL 9 DAY)
        ),
        (
                unhex('faaaaaaaaaaaaaaaaaaaaaaaaaaaaa33'),
                unhex('c6666666666666666666666666666666'),
                unhex('ffffffffffffffffffffffffffffffff'),
                unhex('fffffffffffffffffffffffffffffff2'),
                DATE_SUB(NOW(), INTERVAL 8 DAY)
        ),
        (
                unhex('faaaaaaaaaaaaaaaaaaaaaaaaaaaaa44'),
                unhex('c8888888888888888888888888888888'),
                unhex('ffffffffffffffffffffffffffffffff'),
                unhex('fffffffffffffffffffffffffffffff3'),
                DATE_SUB(NOW(), INTERVAL 7 DAY)
        ),
        (
                unhex('faaaaaaaaaaaaaaaaaaaaaaaaaaaaa55'),
                unhex('caaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
                unhex('ffffffffffffffffffffffffffffffff'),
                unhex('fffffffffffffffffffffffffffffff3'),
                DATE_SUB(NOW(), INTERVAL 6 DAY)
        );
UPDATE survey_options
SET votes = 1
WHERE id = unhex('fffffffffffffffffffffffffffffff1');
-- Нічні приціли
UPDATE survey_options
SET votes = 2
WHERE id = unhex('fffffffffffffffffffffffffffffff2');
-- Тепловізори
UPDATE survey_options
SET votes = 2
WHERE id = unhex('fffffffffffffffffffffffffffffff3');
-- Дрони
-- Голоси для "Навчання та підготовка" (Survey 8)
INSERT INTO votes (
                id,
                user_id,
                survey_id,
                survey_option_id,
                created_at
        )
VALUES (
                unhex('baaaaaaaaaaaaaaaaaaaaaaaaaaaaa11'),
                unhex('cbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'),
                unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb00'),
                unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb01'),
                DATE_SUB(NOW(), INTERVAL 11 DAY)
        ),
        (
                unhex('baaaaaaaaaaaaaaaaaaaaaaaaaaaaa22'),
                unhex('cddddddddddddddddddddddddddddddd'),
                unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb00'),
                unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb01'),
                DATE_SUB(NOW(), INTERVAL 10 DAY)
        ),
        (
                unhex('baaaaaaaaaaaaaaaaaaaaaaaaaaaaa33'),
                unhex('cfffffffffffffffffffffffffffffff'),
                unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb00'),
                unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb02'),
                DATE_SUB(NOW(), INTERVAL 9 DAY)
        ),
        (
                unhex('baaaaaaaaaaaaaaaaaaaaaaaaaaaaa44'),
                unhex('d2222222222222222222222222222222'),
                unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb00'),
                unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb02'),
                DATE_SUB(NOW(), INTERVAL 8 DAY)
        ),
        (
                unhex('baaaaaaaaaaaaaaaaaaaaaaaaaaaaa55'),
                unhex('d4444444444444444444444444444444'),
                unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb00'),
                unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb03'),
                DATE_SUB(NOW(), INTERVAL 7 DAY)
        );
UPDATE survey_options
SET votes = 2
WHERE id = unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb01');
-- Тактична медицина
UPDATE survey_options
SET votes = 2
WHERE id = unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb02');
-- Робота з дронами
UPDATE survey_options
SET votes = 1
WHERE id = unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb03');
-- Тактична підготовка
-- Голоси для "Психологічна підтримка" (Survey 9)
INSERT INTO votes (
                id,
                user_id,
                survey_id,
                survey_option_id,
                created_at
        )
VALUES (
                unhex('caaaaaaaaaaaaaaaaaaaaaaaaaaaaa11'),
                unhex('c1111111111111111111111111111111'),
                unhex('cccccccccccccccccccccccccccccc00'),
                unhex('cccccccccccccccccccccccccccccc01'),
                DATE_SUB(NOW(), INTERVAL 12 DAY)
        ),
        (
                unhex('caaaaaaaaaaaaaaaaaaaaaaaaaaaaa22'),
                unhex('c5555555555555555555555555555555'),
                unhex('cccccccccccccccccccccccccccccc00'),
                unhex('cccccccccccccccccccccccccccccc02'),
                DATE_SUB(NOW(), INTERVAL 11 DAY)
        ),
        (
                unhex('caaaaaaaaaaaaaaaaaaaaaaaaaaaaa33'),
                unhex('c9999999999999999999999999999999'),
                unhex('cccccccccccccccccccccccccccccc00'),
                unhex('cccccccccccccccccccccccccccccc02'),
                DATE_SUB(NOW(), INTERVAL 10 DAY)
        ),
        (
                unhex('caaaaaaaaaaaaaaaaaaaaaaaaaaaaa44'),
                unhex('cddddddddddddddddddddddddddddddd'),
                unhex('cccccccccccccccccccccccccccccc00'),
                unhex('cccccccccccccccccccccccccccccc03'),
                DATE_SUB(NOW(), INTERVAL 9 DAY)
        );
UPDATE survey_options
SET votes = 1
WHERE id = unhex('cccccccccccccccccccccccccccccc01');
-- Індивідуальні консультації
UPDATE survey_options
SET votes = 2
WHERE id = unhex('cccccccccccccccccccccccccccccc02');
-- Групові тренінги
UPDATE survey_options
SET votes = 1
WHERE id = unhex('cccccccccccccccccccccccccccccc03');
-- Реабілітаційні програми
-- Голоси для "Інформаційна безпека" (Survey 10)
INSERT INTO votes (
                id,
                user_id,
                survey_id,
                survey_option_id,
                created_at
        )
VALUES (
                unhex('daaaaaaaaaaaaaaaaaaaaaaaaaaaaa11'),
                unhex('c2222222222222222222222222222222'),
                unhex('dddddddddddddddddddddddddddddddd'),
                unhex('ddddddddddddddddddddddddddddddd1'),
                DATE_SUB(NOW(), INTERVAL 13 DAY)
        ),
        (
                unhex('daaaaaaaaaaaaaaaaaaaaaaaaaaaaa22'),
                unhex('c6666666666666666666666666666666'),
                unhex('dddddddddddddddddddddddddddddddd'),
                unhex('ddddddddddddddddddddddddddddddd1'),
                DATE_SUB(NOW(), INTERVAL 12 DAY)
        ),
        (
                unhex('daaaaaaaaaaaaaaaaaaaaaaaaaaaaa33'),
                unhex('caaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
                unhex('dddddddddddddddddddddddddddddddd'),
                unhex('ddddddddddddddddddddddddddddddd2'),
                DATE_SUB(NOW(), INTERVAL 11 DAY)
        ),
        (
                unhex('daaaaaaaaaaaaaaaaaaaaaaaaaaaaa44'),
                unhex('ceeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'),
                unhex('dddddddddddddddddddddddddddddddd'),
                unhex('ddddddddddddddddddddddddddddddd3'),
                DATE_SUB(NOW(), INTERVAL 10 DAY)
        ),
        (
                unhex('daaaaaaaaaaaaaaaaaaaaaaaaaaaaa55'),
                unhex('d3333333333333333333333333333333'),
                unhex('dddddddddddddddddddddddddddddddd'),
                unhex('ddddddddddddddddddddddddddddddd3'),
                DATE_SUB(NOW(), INTERVAL 9 DAY)
        );
UPDATE survey_options
SET votes = 2
WHERE id = unhex('ddddddddddddddddddddddddddddddd1');
-- Захищені канали зв'язку
UPDATE survey_options
SET votes = 1
WHERE id = unhex('ddddddddddddddddddddddddddddddd2');
-- Шифрування даних
UPDATE survey_options
SET votes = 2
WHERE id = unhex('ddddddddddddddddddddddddddddddd3');
-- Навчання з кібербезпеки
-- Тестове опитування 15: Транспорт для громади
INSERT INTO surveys (
                id,
                created_at,
                open,
                subtitle,
                title,
                user_id,
                image_url
        )
VALUES (
                unhex('111111111111111111111111111111b2'),
                NOW(),
                1,
                'Який вид транспорту найбільш потрібен у вашій громаді?',
                'Транспорт для громади',
                unhex('11111111111111111111111111111111'),
                NULL
        );
INSERT INTO survey_options (id, survey_id, name, votes)
VALUES (
                unhex('111111111111111111111111111111b3'),
                unhex('111111111111111111111111111111b2'),
                'Автобуси',
                0
        ),
        (
                unhex('111111111111111111111111111111b4'),
                unhex('111111111111111111111111111111b2'),
                'Велосипеди',
                0
        ),
        (
                unhex('111111111111111111111111111111b5'),
                unhex('111111111111111111111111111111b2'),
                'Електросамокати',
                0
        );
-- Тестове опитування 16: Дистанційна робота
INSERT INTO surveys (
                id,
                created_at,
                open,
                subtitle,
                title,
                user_id,
                image_url
        )
VALUES (
                unhex('111111111111111111111111111111b6'),
                NOW(),
                1,
                'Які переваги дистанційної роботи для вас найважливіші?',
                'Дистанційна робота',
                unhex('11111111111111111111111111111111'),
                NULL
        );
INSERT INTO survey_options (id, survey_id, name, votes)
VALUES (
                unhex('111111111111111111111111111111b7'),
                unhex('111111111111111111111111111111b6'),
                'Гнучкий графік',
                0
        ),
        (
                unhex('111111111111111111111111111111b8'),
                unhex('111111111111111111111111111111b6'),
                'Відсутність витрат на дорогу',
                0
        ),
        (
                unhex('111111111111111111111111111111b9'),
                unhex('111111111111111111111111111111b6'),
                'Можливість працювати з будь-якого місця',
                0
        );
-- Тестове опитування 17: Здоровий спосіб життя
INSERT INTO surveys (
                id,
                created_at,
                open,
                subtitle,
                title,
                user_id,
                image_url
        )
VALUES (
                unhex('111111111111111111111111111111ba'),
                NOW(),
                1,
                'Що для вас є основою здорового способу життя?',
                'Здоровий спосіб життя',
                unhex('11111111111111111111111111111111'),
                NULL
        );
INSERT INTO survey_options (id, survey_id, name, votes)
VALUES (
                unhex('111111111111111111111111111111bb'),
                unhex('111111111111111111111111111111ba'),
                'Збалансоване харчування',
                0
        ),
        (
                unhex('111111111111111111111111111111bc'),
                unhex('111111111111111111111111111111ba'),
                'Регулярна фізична активність',
                0
        ),
        (
                unhex('111111111111111111111111111111bd'),
                unhex('111111111111111111111111111111ba'),
                'Повноцінний сон',
                0
        );
-- Тестове опитування 18: Вивчення мов
INSERT INTO surveys (
                id,
                created_at,
                open,
                subtitle,
                title,
                user_id,
                image_url
        )
VALUES (
                unhex('111111111111111111111111111111be'),
                NOW(),
                1,
                'Яку мову ви хотіли б вивчити наступною?',
                'Вивчення мов',
                unhex('11111111111111111111111111111111'),
                NULL
        );
INSERT INTO survey_options (id, survey_id, name, votes)
VALUES (
                unhex('111111111111111111111111111111bf'),
                unhex('111111111111111111111111111111be'),
                'Англійська',
                0
        ),
        (
                unhex('111111111111111111111111111111c0'),
                unhex('111111111111111111111111111111be'),
                'Німецька',
                0
        ),
        (
                unhex('111111111111111111111111111111c1'),
                unhex('111111111111111111111111111111be'),
                'Польська',
                0
        );
-- Тестове опитування 19: Культурні події
INSERT INTO surveys (
                id,
                created_at,
                open,
                subtitle,
                title,
                user_id,
                image_url
        )
VALUES (
                unhex('111111111111111111111111111111c2'),
                NOW(),
                1,
                'Які культурні події ви відвідуєте найчастіше?',
                'Культурні події',
                unhex('11111111111111111111111111111111'),
                NULL
        );
INSERT INTO survey_options (id, survey_id, name, votes)
VALUES (
                unhex('111111111111111111111111111111c3'),
                unhex('111111111111111111111111111111c2'),
                'Концерти',
                0
        ),
        (
                unhex('111111111111111111111111111111c4'),
                unhex('111111111111111111111111111111c2'),
                'Виставки',
                0
        ),
        (
                unhex('111111111111111111111111111111c5'),
                unhex('111111111111111111111111111111c2'),
                'Театральні вистави',
                0
        );
-- Тестове опитування 20: Енергозбереження
INSERT INTO surveys (
                id,
                created_at,
                open,
                subtitle,
                title,
                user_id,
                image_url
        )
VALUES (
                unhex('111111111111111111111111111111c6'),
                NOW(),
                1,
                'Який спосіб енергозбереження ви використовуєте найчастіше?',
                'Енергозбереження',
                unhex('11111111111111111111111111111111'),
                NULL
        );
INSERT INTO survey_options (id, survey_id, name, votes)
VALUES (
                unhex('111111111111111111111111111111c7'),
                unhex('111111111111111111111111111111c6'),
                'LED-освітлення',
                0
        ),
        (
                unhex('111111111111111111111111111111c8'),
                unhex('111111111111111111111111111111c6'),
                'Теплоізоляція',
                0
        ),
        (
                unhex('111111111111111111111111111111c9'),
                unhex('111111111111111111111111111111c6'),
                'Сонячні панелі',
                0
        );
-- Тестове опитування 21: Волонтерство
INSERT INTO surveys (
                id,
                created_at,
                open,
                subtitle,
                title,
                user_id,
                image_url
        )
VALUES (
                unhex('111111111111111111111111111111ca'),
                NOW(),
                1,
                'У якій сфері ви хотіли б волонтерити?',
                'Волонтерство',
                unhex('11111111111111111111111111111111'),
                NULL
        );
INSERT INTO survey_options (id, survey_id, name, votes)
VALUES (
                unhex('111111111111111111111111111111cb'),
                unhex('111111111111111111111111111111ca'),
                'Допомога армії',
                0
        ),
        (
                unhex('111111111111111111111111111111cc'),
                unhex('111111111111111111111111111111ca'),
                'Підтримка дітей',
                0
        ),
        (
                unhex('111111111111111111111111111111cd'),
                unhex('111111111111111111111111111111ca'),
                'Захист довкілля',
                0
        );
-- Тестове опитування 22: Мобільні додатки
INSERT INTO surveys (
                id,
                created_at,
                open,
                subtitle,
                title,
                user_id,
                image_url
        )
VALUES (
                unhex('111111111111111111111111111111ce'),
                NOW(),
                1,
                'Які мобільні додатки ви використовуєте найчастіше?',
                'Мобільні додатки',
                unhex('11111111111111111111111111111111'),
                NULL
        );
INSERT INTO survey_options (id, survey_id, name, votes)
VALUES (
                unhex('111111111111111111111111111111cf'),
                unhex('111111111111111111111111111111ce'),
                'Месенджери',
                0
        ),
        (
                unhex('111111111111111111111111111111d0'),
                unhex('111111111111111111111111111111ce'),
                'Новини',
                0
        ),
        (
                unhex('111111111111111111111111111111d1'),
                unhex('111111111111111111111111111111ce'),
                'Навчальні платформи',
                0
        );
-- Тестове опитування 23: Відновлення інфраструктури
INSERT INTO surveys (
                id,
                created_at,
                open,
                subtitle,
                title,
                user_id,
                image_url
        )
VALUES (
                unhex('111111111111111111111111111111d2'),
                NOW(),
                1,
                'Які об`єкти інфраструктури потребують першочергового відновлення ?',
                'Відновлення інфраструктури',
                unhex('11111111111111111111111111111111'),
                NULL
        );
INSERT INTO survey_options (id, survey_id, name, votes)
VALUES (
                unhex('111111111111111111111111111111d3'),
                unhex('111111111111111111111111111111d2'),
                'Дороги',
                0
        ),
        (
                unhex('111111111111111111111111111111d4'),
                unhex('111111111111111111111111111111d2'),
                'Мости',
                0
        ),
        (
                unhex('111111111111111111111111111111d5'),
                unhex('111111111111111111111111111111d2'),
                'Школи',
                0
        );
-- Тестове опитування 24: Безпека в інтернеті
INSERT INTO surveys (
                id,
                created_at,
                open,
                subtitle,
                title,
                user_id,
                image_url
        )
VALUES (
                unhex('111111111111111111111111111111d6'),
                NOW(),
                1,
                'Які заходи безпеки в інтернеті ви вважаєте найефективнішими ?',
                'Безпека в інтернеті',
                unhex('11111111111111111111111111111111'),
                NULL
        );
INSERT INTO survey_options (id, survey_id, name, votes)
VALUES (
                unhex('111111111111111111111111111111d7'),
                unhex('111111111111111111111111111111d6'),
                'Двофакторна аутентифікація',
                0
        ),
        (
                unhex('111111111111111111111111111111d8'),
                unhex('111111111111111111111111111111d6'),
                'Складні паролі',
                0
        ),
        (
                unhex('111111111111111111111111111111d9'),
                unhex('111111111111111111111111111111d6'),
                'VPN',
                0
        );
-- Тестове опитування 25: Урбаністика
INSERT INTO surveys (
                id,
                created_at,
                open,
                subtitle,
                title,
                user_id,
                image_url
        )
VALUES (
                unhex('111111111111111111111111111111da'),
                NOW(),
                1,
                'Які зміни в міському просторі ви підтримуєте?',
                'Урбаністика',
                unhex('11111111111111111111111111111111'),
                NULL
        );
INSERT INTO survey_options (id, survey_id, name, votes)
VALUES (
                unhex('111111111111111111111111111111db'),
                unhex('111111111111111111111111111111da'),
                'Більше зелених зон',
                0
        ),
        (
                unhex('111111111111111111111111111111dc'),
                unhex('111111111111111111111111111111da'),
                'Розвиток велоінфраструктури',
                0
        ),
        (
                unhex('111111111111111111111111111111dd'),
                unhex('111111111111111111111111111111da'),
                'Доступний громадський транспорт',
                0
        );
-- Тестове опитування 26: Вивчення мов
INSERT INTO surveys (
                id,
                created_at,
                open,
                subtitle,
                title,
                user_id,
                image_url
        )
VALUES (
                unhex('111111111111111111111111111111a4'),
                NOW(),
                1,
                'Який вид відпочинку після ротації ви вважаєте найкращим?',
                'Відпочинок після ротації',
                unhex('11111111111111111111111111111111'),
                NULL
        );
INSERT INTO survey_options (id, survey_id, name, votes)
VALUES (
                unhex('111111111111111111111111111111e1'),
                unhex('111111111111111111111111111111a4'),
                'Санаторій',
                0
        ),
        (
                unhex('111111111111111111111111111111e2'),
                unhex('111111111111111111111111111111a4'),
                'Відпустка з родиною',
                0
        ),
        (
                unhex('111111111111111111111111111111e3'),
                unhex('111111111111111111111111111111a4'),
                'Активний туризм',
                0
        );
-- Тестовые просмотры для всех опросов
UPDATE surveys
SET views = 42
WHERE id = unhex('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
-- Логістичні потреби
UPDATE surveys
SET views = 77
WHERE id = unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
-- Медичне забезпечення
UPDATE surveys
SET views = 56
WHERE id = unhex('cccccccccccccccccccccccccccccccc');
-- Засоби зв'язку
UPDATE surveys
SET views = 61
WHERE id = unhex('ddddddddddddddddddddddddddddddd1');
-- Захист та безпека
UPDATE surveys
SET views = 38
WHERE id = unhex('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
-- Харчування та побут
UPDATE surveys
SET views = 89
WHERE id = unhex('ffffffffffffffffffffffffffffffff');
-- Технічне обладнання
UPDATE surveys
SET views = 74
WHERE id = unhex('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb00');
-- Навчання та підготовка
UPDATE surveys
SET views = 53
WHERE id = unhex('cccccccccccccccccccccccccccccc00');
-- Психологічна підтримка
UPDATE surveys
SET views = 68
WHERE id = unhex('dddddddddddddddddddddddddddddddd');
-- Інформаційна безпека
UPDATE surveys
SET views = 35
WHERE id = unhex('feedfeedfeedfeedfeedfeedfeedfeed');
-- Тестове опитування
-- Обновление общего количества голосов для опросов (votes_count)
UPDATE surveys
SET votes_count = (
                SELECT SUM(votes)
                FROM survey_options
                WHERE survey_options.survey_id = surveys.id
        );