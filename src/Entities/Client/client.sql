-------------------------------------
Client 
id,name,address,phone,deleted

CREATE TABLE client (
    id INT PRIMARY KEY IDENTITY (1, 1),
    name VARCHAR (100) NOT NULL,
    address VARCHAR (255),
    phone VARCHAR (55),
    deleted VARCHAR(10) NOT NULL DEFAULT 00
);

---++++++++++++++++++++++++++++++++--
CREATE OR ALTER PROCEDURE Insert_Into_Client
 @name varchar (100),
 @address varchar (255),
 @phone VARCHAR (55)
AS
BEGIN
    INSERT  INTO client
     (name,address,phone)
    VALUES
     (@name, @address,@phone)
END
---++++++++++++++++++++++++++++++++--
CREATE OR ALTER PROCEDURE Get_All_Clients
@offset int = 0,
@limit int = 10
AS
BEGIN
    SELECT *
    FROM   client Where deleted = 0 
        ORDER BY client.id DESC
    OFFSET	(@offset) ROWS FETCH NEXT (@limit) ROWS ONLY
END
---++++++++++++++++++++++++++++++++--
CREATE OR ALTER PROCEDURE Get_Client_By_ID
@id INT
AS
BEGIN
    SELECT *
    FROM   client
    WHERE  id = @id;
END
---++++++++++++++++++++++++++++++++--
CREATE OR ALTER PROCEDURE Get_Client_By_Name
@name VARCHAR
AS
BEGIN
   SELECT * from client where name like '%'+@name+'%'
END
---++++++++++++++++++++++++++++++++--
CREATE OR ALTER PROCEDURE Update_Client
    @id int,
    @name varchar(100) = NULL,
    @address varchar(255) = NULL,
    @phone varchar(55) = NULL

AS
BEGIN
    UPDATE client
    SET
    name=ISNULL(@name,name), 
    address=ISNULL(@address,address),
    phone=ISNULL(@phone,phone)
    WHERE id=@id
END
---++++++++++++++++++++++++++++++++--
CREATE OR ALTER   PROCEDURE Delete_Client
@id INT NULL
AS
IF (@id  IS NOT NULL) 
    BEGIN
        UPDATE client
        SET    deleted = 1
        WHERE  id = @id;
    END
ELSE
    RETURN -1;
-----------------------------------------