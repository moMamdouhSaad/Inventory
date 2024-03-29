-------------------------------------
Category 
id,name,description,status

CREATE TABLE category (
    id INT PRIMARY KEY IDENTITY (1, 1),
    name VARCHAR (100) NOT NULL,
    description VARCHAR (255),
    status VARCHAR(10) NOT NULL DEFAULT 00
);

ALTER TABLE Category 
ADD status VARCHAR (10) NOT NULL DEFAULT 00
---++++++++++++++++++++++++++++++++--
CREATE OR ALTER PROCEDURE Insert_Into_Category
 @name varchar (255),
 @description varchar (255)
AS
BEGIN
    INSERT  INTO Category
     (name, description)
    VALUES
     (@name, @description)
END
---++++++++++++++++++++++++++++++++--
CREATE OR ALTER PROCEDURE Get_All_Categories
@offset int = 0,
@limit int = 10
AS
BEGIN
    SELECT *
    FROM  Category Where status != 'ff' 
    ORDER BY Category.id DESC
OFFSET	(@offset) ROWS FETCH NEXT (@limit) ROWS ONLY
END
---++++++++++++++++++++++++++++++++--
CREATE OR ALTER PROCEDURE Get_Category_By_ID
@id INT
AS
BEGIN
    SELECT *
    FROM   Category
    WHERE  id = @id;
END
---++++++++++++++++++++++++++++++++--
CREATE OR ALTER PROCEDURE Get_Category_By_Name
@name VARCHAR
AS
BEGIN
   SELECT * from Category where name like '%'+@name+'%'
END
---++++++++++++++++++++++++++++++++--
CREATE OR ALTER PROCEDURE Update_Category
    @id int,
    @name varchar(100) = NULL,
    @description varchar(255) = NULL
AS
BEGIN
    UPDATE Category
    SET name=ISNULL(@name,name), 
    description=ISNULL(@description,description)
    WHERE id=@id
END
---++++++++++++++++++++++++++++++++--
CREATE OR ALTER   PROCEDURE Delete_Category
@id INT NULL
AS
IF (@id  IS NOT NULL) 
    BEGIN
        UPDATE Category
        SET    status = 'FF'
        WHERE  id = @id;
    END
ELSE
    RETURN -1;
-----------------------------------------