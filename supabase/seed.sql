-- Seed data for local development
-- 1 school, 2 classes, 5 players

-- School
INSERT INTO schools (id, name, code) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'École Primaire Jules Verne', 'VERNE01');

-- Classes
INSERT INTO classes (id, school_id, name, join_code, grade_level) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'CE1 A', 'CE1A2025', 2),
  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'CM1 B', 'CM1B2025', 4);

-- Players (CE1 A - 3 players)
INSERT INTO players (id, class_id, username, avatar_id, level, sublevel, xp, gems) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Luna', 'avatar_cat', 2, 3, 450, 12),
  ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Théo', 'avatar_robot', 1, 5, 280, 8),
  ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'Léa', 'avatar_unicorn', 3, 1, 720, 25);

-- Players (CM1 B - 2 players)
INSERT INTO players (id, class_id, username, avatar_id, level, sublevel, xp, gems) VALUES
  ('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000002', 'Enzo', 'avatar_dragon', 4, 2, 1100, 45),
  ('c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000002', 'Jade', 'avatar_fox', 3, 4, 890, 32);

-- Progress for each player
INSERT INTO progress (player_id, current_level, current_sublevel, topic_mastery, total_sessions, total_questions, total_correct) VALUES
  ('c0000000-0000-0000-0000-000000000001', 2, 3, '{"addition": 0.85, "subtraction": 0.72}', 15, 200, 170),
  ('c0000000-0000-0000-0000-000000000002', 1, 5, '{"addition": 0.65, "subtraction": 0.50}', 8, 100, 65),
  ('c0000000-0000-0000-0000-000000000003', 3, 1, '{"addition": 0.92, "subtraction": 0.88, "multiplication": 0.60}', 25, 350, 310),
  ('c0000000-0000-0000-0000-000000000004', 4, 2, '{"addition": 0.95, "subtraction": 0.90, "multiplication": 0.78, "division": 0.55}', 40, 600, 510),
  ('c0000000-0000-0000-0000-000000000005', 3, 4, '{"addition": 0.90, "subtraction": 0.85, "multiplication": 0.70}', 30, 450, 380);

-- A few achievements
INSERT INTO achievements (player_id, achievement_id) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'first_session'),
  ('c0000000-0000-0000-0000-000000000001', 'streak_5'),
  ('c0000000-0000-0000-0000-000000000003', 'first_session'),
  ('c0000000-0000-0000-0000-000000000003', 'streak_10'),
  ('c0000000-0000-0000-0000-000000000003', 'level_3'),
  ('c0000000-0000-0000-0000-000000000004', 'first_session'),
  ('c0000000-0000-0000-0000-000000000004', 'streak_10'),
  ('c0000000-0000-0000-0000-000000000004', 'level_4');
