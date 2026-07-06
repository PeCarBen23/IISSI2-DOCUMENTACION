DROP TABLE IF EXISTS Comments;
DROP TABLE IF EXISTS UserHobbies;
DROP TABLE IF EXISTS Hobbies;
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
  userId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  fullName VARCHAR(256) NOT NULL,
  username VARCHAR(64) UNIQUE NOT NULL,
  avatarUrl VARCHAR(512),
  city VARCHAR(128),
  age INT,
  password VARCHAR(512) NOT NULL
);

CREATE TABLE Hobbies (
  hobbyId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(128) UNIQUE NOT NULL
);

CREATE TABLE UserHobbies (
  userId INT NOT NULL,
  hobbyId INT NOT NULL,
  affinity INT NOT NULL,
  PRIMARY KEY (userId, hobbyId),
  FOREIGN KEY (userId) REFERENCES Users(userId),
  FOREIGN KEY (hobbyId) REFERENCES Hobbies(hobbyId),
  CHECK (affinity BETWEEN 1 AND 5)
);

CREATE TABLE Comments (
  commentId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  authorUserId INT,
  targetUserId INT NOT NULL,
  createdAt DATETIME NOT NULL,
  commentText TEXT NOT NULL,
  FOREIGN KEY (authorUserId) REFERENCES Users(userId),
  FOREIGN KEY (targetUserId) REFERENCES Users(userId)
);

-- La password de todos los usuarios es iissi
INSERT INTO Users (userId, fullName, username, password, avatarUrl, city, age) VALUES
	(1, 'Carlos Arévalo', 'carevalo', 'pbkdf2:sha256:150000$MjN72ikE$897d960e08be9150d943c747ff6194904fd325821945ff7d7f5c1d1d08b40bbd', 'https://randomuser.me/api/portraits/men/62.jpg', 'Sevilla', 25),
	(2, 'Beatriz Barrios', 'beatriz', 'pbkdf2:sha256:150000$MjN72ikE$897d960e08be9150d943c747ff6194904fd325821945ff7d7f5c1d1d08b40bbd', 'https://randomuser.me/api/portraits/women/10.jpg', 'Barcelona', 30),
	(3, 'Claudia Carmona', 'claudia', 'pbkdf2:sha256:150000$MjN72ikE$897d960e08be9150d943c747ff6194904fd325821945ff7d7f5c1d1d08b40bbd', 'https://randomuser.me/api/portraits/women/11.jpg', 'Valencia', 35),
  (4, 'David Díaz', 'david', 'pbkdf2:sha256:150000$MjN72ikE$897d960e08be9150d943c747ff6194904fd325821945ff7d7f5c1d1d08b40bbd', 'https://randomuser.me/api/portraits/men/61.jpg', 'Sevilla', 40),
  (5, 'Elena Esteban', 'elena', 'pbkdf2:sha256:150000$MjN72ikE$897d960e08be9150d943c747ff6194904fd325821945ff7d7f5c1d1d08b40bbd', 'https://randomuser.me/api/portraits/women/20.jpg', 'Bilbao', 45),
  (6, 'Fernando Fernández', 'fernando', 'pbkdf2:sha256:150000$MjN72ikE$897d960e08be9150d943c747ff6194904fd325821945ff7d7f5c1d1d08b40bbd', 'https://randomuser.me/api/portraits/men/1.jpg', 'Málaga', 50),
  (7, 'Gloria Gómez', 'gloria', 'pbkdf2:sha256:150000$MjN72ikE$897d960e08be9150d943c747ff6194904fd325821945ff7d7f5c1d1d08b40bbd', 'https://randomuser.me/api/portraits/women/25.jpg', 'Zaragoza', 55),
  (8, 'Héctor Hernández', 'hector', 'pbkdf2:sha256:150000$MjN72ikE$897d960e08be9150d943c747ff6194904fd325821945ff7d7f5c1d1d08b40bbd', 'https://randomuser.me/api/portraits/men/99.jpg', 'Alicante', 60);

INSERT INTO Hobbies (hobbyId, name) VALUES
  (1, 'Senderismo'),
  (2, 'Lectura'),
  (3, 'Cine'),
  (4, 'Cocina'),
  (5, 'Fotografía'),
  (6, 'Viajar'),
  (7, 'Videojuegos'),
  (8, 'Música');

INSERT INTO UserHobbies (userId, hobbyId, affinity) VALUES
  (1, 1, 5),
  (1, 3, 4),
  (1, 6, 3),
  (2, 2, 5),
  (2, 4, 4),
  (2, 8, 3),
  (3, 2, 4),
  (3, 5, 5),
  (3, 6, 4),
  (4, 1, 3),
  (4, 7, 5),
  (4, 8, 2),
  (5, 3, 4),
  (5, 4, 5),
  (5, 6, 5),
  (6, 1, 4),
  (6, 5, 3),
  (6, 8, 5),
  (7, 2, 5),
  (7, 3, 3),
  (7, 6, 4),
  (8, 5, 4),
  (8, 7, 4),
  (8, 8, 5);

INSERT INTO Comments (commentId, authorUserId, targetUserId, createdAt, commentText) VALUES
  (1, 2, 1, '2026-05-10 18:30:00', 'Muy buen compañero para rutas de fin de semana.'),
  (2, 3, 1, '2026-05-11 20:15:00', 'Siempre recomienda peliculas interesantes.'),
  (3, NULL, 2, '2026-05-12 09:45:00', 'Perfil muy completo y agradable.'),
  (4, 5, 3, '2026-05-13 12:00:00', 'Hace unas fotos espectaculares en cada viaje.'),
  (5, 1, 5, '2026-05-14 17:20:00', 'Gran conversacion y muy simpatica.'),
  (6, NULL, 6, '2026-05-15 22:10:00', 'Se nota que sabe mucho de musica.'),
  (7, 8, 7, '2026-05-16 11:05:00', 'Comparte recomendaciones de lectura muy buenas.'),
  (8, 4, 8, '2026-05-17 19:40:00', 'Siempre tiene algun plan entretenido que proponer.');
