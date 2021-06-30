Product 
     (barcode,name, description,stock_qty,price,is_active,deleted,company_id,category_id,uom_id)
------------------------------------
CREATE TABLE product (
    id INT PRIMARY KEY IDENTITY (1, 1),
    barcode VARCHAR (255), 
    name VARCHAR (100) NOT NULL,
    description VARCHAR (255),
    stock_qty int NOT NULL,
    price int NOT NULL,
    is_active BIT NOT NULL DEFAULT 1,
    deleted BIT NOT NULL DEFAULT 0,
    company_id int NOT NULL,
    category_id int NOT NULL,
    uom_id int NOT NULL,
	FOREIGN KEY (company_id) REFERENCES  company(id),
    FOREIGN KEY (category_id) REFERENCES  category(id),
    FOREIGN KEY (uom_id) REFERENCES  uom(id),
);

---++++++++++++++++++++++++++++++++--
CREATE OR ALTER PROCEDURE Insert_Into_Product
 @barcode varchar (255),
 @name varchar (255),
 @description varchar (255),
 @stock_qty int,
 @price int,
 @company_id int,
 @category_id int,
 @uom_id int
AS
BEGIN
    INSERT  INTO Product
     (barcode,name, description,stock_qty,price,company_id,category_id,uom_id)
    VALUES
     (@barcode,@name, @description,@stock_qty,@price,@company_id,@category_id,@uom_id)
END
---++++++++++++++++++++++++++++++++--

---++++++++++++++++++++++++++++++++--
CREATE OR ALTER PROCEDURE Get_All_Products
@offset int = 0,
@limit int = 10
AS
BEGIN
    Select p.id,p.barcode,p.name,p.description,p.stock_qty,p.price,p.is_active,co.name as company_name,c.name as category_name,u.name uom_name from product p join Category c on p.category_id = c.id
join company co on p.company_id = co.id
join uom u on p.uom_id = u.id where p.deleted = 0 
ORDER BY p.id DESC
OFFSET	(@offset) ROWS FETCH NEXT (@limit) ROWS ONLY
END
---++++++++++++++++++++++++++++++++--
CREATE OR ALTER PROCEDURE Get_Product_By_ID
@id INT
AS
BEGIN
Select p.id,p.barcode,p.name,p.description,p.stock_qty,p.price,p.is_active,co.name as company_name,c.name as category_name,u.name uom_name from product p join Category c on p.category_id = c.id
join company co on p.company_id = co.id
join uom u on p.uom_id = u.id where p.deleted = 0 AND p.id = @id
END
---++++++++++++++++++++++++++++++++--
CREATE OR ALTER PROCEDURE Get_Product_By_name
@name VARCHAR
AS
BEGIN
Select p.id,p.barcode,p.name,p.description,p.stock_qty,p.price,p.is_active,co.name as company_name,c.name as category_name,u.name uom_name from product p join Category c on p.category_id = c.id
join company co on p.company_id = co.id
join uom u on p.uom_id = u.id where p.deleted = 0 AND p.name like '%'+@name+'%'
END
---++++++++++++++++++++++++++++++++--
CREATE OR ALTER   PROCEDURE Delete_Product
@id INT NULL
AS
IF (@id  IS NOT NULL) 
    BEGIN
        UPDATE product
        SET    deleted = 1
        WHERE  id = @id;
    END
ELSE
    RETURN -1;
---++++++++++++++++++++++++++++++++--
---++++++++++++++++++++++++++++++++--
CREATE OR ALTER PROCEDURE Update_Product
   @id int,
   @barcode varchar (255),
   @name varchar (255),
   @description varchar (255),
   @stock_qty int,
   @price int,
   @is_active bit,
   @company_id int,
   @category_id int,
   @uom_id int
AS
BEGIN
    UPDATE product
    SET
    barcode=ISNULL(@barcode,barcode), 
    name=ISNULL(@name,name),
    description=ISNULL(@description,description),
    stock_qty=ISNULL(@stock_qty,stock_qty),
    price=ISNULL(@price,price),
    is_active=ISNULL(@is_active,is_active),
    company_id=ISNULL(@company_id,company_id),
    category_id=ISNULL(@category_id,category_id),
    uom_id=ISNULL(@uom_id,uom_id)
    WHERE id=@id
END
---++++++++++++++++++++++++++++++++--

