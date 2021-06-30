-------------------------------------
Supplier 
id,name,address,phone,deleted

CREATE TABLE supplier (
    id INT PRIMARY KEY IDENTITY (1, 1),
    name VARCHAR (100) NOT NULL,
    address VARCHAR (255),
    phone VARCHAR (55),
    deleted VARCHAR(10) NOT NULL DEFAULT 00
);

---++++++++++++++++++++++++++++++++--
CREATE OR ALTER PROCEDURE Insert_Into_Supplier
 @name varchar (100),
 @address varchar (255),
 @phone VARCHAR (55)
AS
BEGIN
    INSERT  INTO supplier
     (name,address,phone)
    VALUES
     (@name, @address,@phone)
END
---++++++++++++++++++++++++++++++++--
CREATE OR ALTER PROCEDURE Get_All_Suppliers
@offset int = 0,
@limit int = 10
AS
BEGIN
    SELECT *
    FROM   supplier Where deleted = 0 
    ORDER BY supplier.id DESC
OFFSET	(@offset) ROWS FETCH NEXT (@limit) ROWS ONLY
END
---++++++++++++++++++++++++++++++++--
CREATE OR ALTER PROCEDURE Get_Supplier_By_ID
@id INT
AS
BEGIN
    SELECT *
    FROM   supplier
    WHERE  id = @id;
END
---++++++++++++++++++++++++++++++++--
CREATE OR ALTER PROCEDURE Get_Supplier_By_Name
@name VARCHAR
AS
BEGIN
   SELECT * from supplier where name like '%'+@name+'%'
END
---++++++++++++++++++++++++++++++++--
CREATE OR ALTER PROCEDURE Update_Supplier
    @id int,
    @name varchar(100) = NULL,
    @address varchar(255) = NULL,
    @phone varchar(55) = NULL

AS
BEGIN
    UPDATE supplier
    SET
    name=ISNULL(@name,name), 
    address=ISNULL(@address,address),
    phone=ISNULL(@phone,phone)
    WHERE id=@id
END
---++++++++++++++++++++++++++++++++--
CREATE OR ALTER   PROCEDURE Delete_Supplier
@id INT NULL
AS
IF (@id  IS NOT NULL) 
    BEGIN
        UPDATE supplier
        SET    deleted = 1
        WHERE  id = @id;
    END
ELSE
    RETURN -1;
-----------------------------------------