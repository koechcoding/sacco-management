
CREATE OR ALTER PROCEDURE insertOrUpdateUser
@id VARCHAR ( 255 ),
@name VARCHAR ( 255 ),
@email VARCHAR ( 255 ),
@password VARCHAR ( 255 ),
@created_at DATE,
@updated_at DATE,
@is_sent BIT,
@is_admin BIT,
@is_deleted BIT
AS
BEGIN
    IF EXISTS (SELECT * FROM users WHERE id = @id)
    BEGIN
        UPDATE users SET name = @name, email = @email, password = @password, created_at = @created_at, updated_at = @updated_at, is_sent = @is_sent, is_admin = @is_admin, is_deleted = @is_deleted WHERE id = @id
        SELECT * FROM users WHERE id = @id
    END
    ELSE
    BEGIN
        INSERT INTO users (id, name, email, password, created_at, updated_at, is_sent, is_admin, is_deleted) VALUES (@id, @name, @email, @password, @created_at, @updated_at, @is_sent, @is_admin, @is_deleted)
        SELECT * FROM users WHERE id = @id
    END
END