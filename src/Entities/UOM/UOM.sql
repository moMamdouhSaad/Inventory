-------------------------------------
uom 
id,name,description

CREATE TABLE uom (
    id INT PRIMARY KEY IDENTITY (1, 1),
    name VARCHAR (100) NOT NULL,
    description VARCHAR (255),
);

---++++++++++++++++++++++++++++++++--
CREATE OR ALTER PROCEDURE Insert_Into_Uom
 @name varchar (255),
 @description varchar (255)
AS
BEGIN
    INSERT  INTO uom
     (name, description)
    VALUES
     (@name, @description)
END
---++++++++++++++++++++++++++++++++--
CREATE OR ALTER PROCEDURE Get_All_Uom
AS
BEGIN
    SELECT *
    FROM   uom;
END
---++++++++++++++++++++++++++++++++--
CREATE OR ALTER PROCEDURE Get_Uom_By_Name
@name VARCHAR
AS
BEGIN
   SELECT * from uom where name like '%'+@name+'%'
END
---++++++++++++++++++++++++++++++++--
CREATE OR ALTER PROCEDURE Update_uom
    @id int,
    @name varchar(100) = NULL,
    @description varchar(255) = NULL
AS
BEGIN
    UPDATE uom
    SET name=ISNULL(@name,name), 
    description=ISNULL(@description,description)
    WHERE id=@id
END
---++++++++++++++++++++++++++++++++--

-----------------------------------------