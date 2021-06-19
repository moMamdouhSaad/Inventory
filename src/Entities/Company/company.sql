-------------------------------------
Company 
id,name,description,status

CREATE TABLE Company (
    id INT PRIMARY KEY IDENTITY (1, 1),
    name VARCHAR (100) NOT NULL,
    description VARCHAR (255),
    status VARCHAR(10) NOT NULL DEFAULT 00
);

---++++++++++++++++++++++++++++++++--
CREATE OR ALTER PROCEDURE Insert_Into_Company
 @name varchar (255),
 @description varchar (255)
AS
BEGIN
    INSERT  INTO Company
     (name, description)
    VALUES
     (@name, @description)
END
---++++++++++++++++++++++++++++++++--
CREATE OR ALTER PROCEDURE Get_All_Companies
AS
BEGIN
    SELECT *
    FROM   Company Where status != 'ff' ;
END
---++++++++++++++++++++++++++++++++--
CREATE OR ALTER PROCEDURE Get_Company_By_ID
@id INT
AS
BEGIN
    SELECT *
    FROM   Company
    WHERE  id = @id;
END
---++++++++++++++++++++++++++++++++--
CREATE OR ALTER PROCEDURE Get_Company_By_Name
@name VARCHAR
AS
BEGIN
   SELECT * from Company where name like '%'+@name+'%'
END
---++++++++++++++++++++++++++++++++--
CREATE OR ALTER PROCEDURE Update_Company
    @id int,
    @name varchar(100) = NULL,
    @description varchar(255) = NULL
AS
BEGIN
    UPDATE Company
    SET name=ISNULL(@name,name), 
    description=ISNULL(@description,description)
    WHERE id=@id
END
---++++++++++++++++++++++++++++++++--
CREATE OR ALTER   PROCEDURE Delete_Company
@id INT NULL
AS
IF (@id  IS NOT NULL) 
    BEGIN
        UPDATE Company
        SET    status = 'FF'
        WHERE  id = @id;
    END
ELSE
    RETURN -1;
-----------------------------------------