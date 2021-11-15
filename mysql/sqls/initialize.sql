CREATE DATABASE IF NOT EXISTS app;
USE app;


CREATE TABLE IF NOT EXISTS User (
  id int PRIMARY KEY AUTO_INCREMENT,
  nickname varchar(20) NOT NULL,
  rate int DEFAULT 100
);

CREATE TABLE IF NOT EXISTS Game_result (
  id int PRIMARY KEY AUTO_INCREMENT,
  user_id int NOT NULL,
  opponent_id int NOT NULL,
  win_flag boolean DEFAULT false,
  FOREIGN KEY(user_id) REFERENCES User(id),
  FOREIGN KEY(opponent_id) REFERENCES User(id)
);

CREATE TABLE IF NOT EXISTS Room (
  id int PRIMARY KEY AUTO_INCREMENT,
  session_room int NOT NULL,
  join_user int DEFAULT 0,
  answer int NOT NULL,
  count_num int DEFAULT 1
);
