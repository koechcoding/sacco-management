CREATE OR ALTER PROCEDURE deleteUser
@id VARCHAR ( 255 )
AS
BEGIN
    SELECT * FROM users WHERE id = @id
    DELETE FROM users WHERE id = @id
   
END