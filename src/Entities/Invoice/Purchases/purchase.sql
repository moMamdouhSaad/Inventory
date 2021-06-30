Purchase Table
id (auto)
order_date (auto)
supplier_id (input)
sub_total (auto)
discount_rate (input)
discount_value (auto)
tax_rate (input)
tax_value (auto)
total_price (auto);


CREATE TABLE purchase_order (
    id INT PRIMARY KEY IDENTITY (1, 1),
    order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    supplier_id int NOT NULL,
    sub_total int NOT NULL,
    discount_rate int NOT NULL DEFAULT 0 ,
    discount_value int NOT NULL DEFAULT 0,
    tax_rate int NOT NULL DEFAULT 0,
    tax_value int NOT NULL DEFAULT 0,
    total_price int NOT NULL,
    FOREIGN KEY (supplier_id) REFERENCES  supplier(id),
);

CREATE OR ALTER PROCEDURE Insert_Into_Purchase_Order_AND_Supplier_Account

 @supplier_id int,
 @sub_total int ,
 @discount_rate int,
 @discount_value int,
 @tax_rate int,
 @tax_value int,
 @total_price int,
 @debit int
 AS
BEGIN

    INSERT  INTO purchase_order
     (supplier_id,sub_total, discount_rate,discount_value,tax_rate,tax_value,total_price)
    VALUES
     (@supplier_id,@sub_total, @discount_rate,@discount_value,@tax_rate,@tax_value,@total_price)


     INSERT INTO supplier_account
    (supplier_id, debit, credit)
VALUES
    (@supplier_id, @debit, @total_price)
END




supplier_account Table
id,supplier_id,date,debit(dafa3 money), credit(take products-total-price)

CREATE TABLE supplier_account (
    id INT PRIMARY KEY IDENTITY (1, 1),
    supplier_id int NOT NULL,
    created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    debit int NOT NULL DEFAULT 0,
    credit int NOT NULL DEFAULT 0,
    FOREIGN KEY (supplier_id) REFERENCES  supplier(id),
);




purchase_order_line Table
order_id, product_id ,qty, purchase_price_per_item, Total 

CREATE TABLE purchase_order_line (
    id INT PRIMARY KEY IDENTITY (1, 1),
    order_id int NOT NULL,
    product_id int NOT NULL,
    qty int NOT NULL,
    purchase_price int NOT NULL,
    total_price int NOT NULL,
    FOREIGN KEY (order_id) REFERENCES  purchase_order(id),
    FOREIGN KEY (product_id) REFERENCES  product(id),
);

CREATE OR ALTER PROCEDURE Insert_Purchase_Order_Line
 @order_id int, 
 @product_id int,
 @qty int,
 @purchase_price int,
 @total_price int
AS
BEGIN
SET @order_id  = IDENT_CURRENT('purchase_order')
    INSERT  INTO purchase_order_line
    (order_id,product_id, qty, purchase_price, total_price)
     VALUES
    (@order_id,@product_id, @qty, @purchase_price, @total_price);

DECLARE @oldTotalPrice int
DECLARE @newTotalPrice int
DECLARE @oldProductsQty int
DECLARE @newProductsQty int
DECLARE @average int

SET @oldTotalPrice = (Select (stock_qty * price) as total_cost from product where id = @product_id)
SET @newTotalPrice = @oldTotalPrice +  @total_price
SET @oldProductsQty = (Select [stock_qty] from product where id = @product_id)
SET @newProductsQty =  @oldProductsQty + @qty
SET @average = @newTotalPrice / @newProductsQty 
	 update  product
     set 
     price = @average,
     stock_qty = stock_qty+@qty
     where id=@product_id
END



-- get all
CREATE OR ALTER PROCEDURE Get_All_Purchase_Order
@offset int = 0,
@limit int = 10
AS
BEGIN
  Select * from purchase_order
  ORDER BY purchase_order.id DESC
OFFSET	(@offset) ROWS FETCH NEXT (@limit) ROWS ONLY 
END

-- get sale order line by id
CREATE OR ALTER PROCEDURE Get_Purchase_Order_Lines_By_OderId
 @id INT
AS
BEGIN
  Select p.name as product_name,POL.qty,uom.name as uom_name, POL.purchase_price,POL.total_price from purchase_order_line as POL 
  join product  p on POL.product_id = p.id JOIN uom on p.uom_id = uom.id
  where POL.order_id = @id AND p.deleted =0
 END
 

-- get sale order by id
 CREATE OR ALTER PROCEDURE Get_Purchase_Order_By_ID
@id INT
AS
BEGIN
    SELECT *
    FROM   purchase_order
    WHERE  id = @id;
END

-- get purchase order by clientId
CREATE OR ALTER PROCEDURE Get_Purchase_Order_By_SupplierID
@offset int = 0,
@limit int = 10,
@id INT
AS
BEGIN
    SELECT *
    FROM   purchase_order
    WHERE  supplier_id = @id
    ORDER BY purchase_order.id DESC
OFFSET	(@offset) ROWS FETCH NEXT (@limit) ROWS ONLY
END


 


-- get sale order by date range
 CREATE OR ALTER PROCEDURE Get_Purchase_Order_By_Date_Range
 @offset int = 0,
@limit int = 10,
@from varchar(100),
@to varchar(100)
AS
BEGIN
    SELECT *
    FROM   purchase_order WHERE cast(order_date as date) BETWEEN @from AND @to
    ORDER BY purchase_order.id DESC
OFFSET	(@offset) ROWS FETCH NEXT (@limit) ROWS ONLY
END 


-- 
 CREATE OR ALTER PROCEDURE Get_Purchase_Order_By_SupplierID_And_DateRange
@offset int = 0,
@limit int = 10,
@supplier_id int, 
@from varchar(100),
@to varchar(100)
AS
BEGIN
    SELECT *
    FROM   purchase_order WHERE cast(order_date as date) BETWEEN @from AND @to
    AND supplier_id = @supplier_id 
    ORDER BY purchase_order.id DESC
OFFSET	(@offset) ROWS FETCH NEXT (@limit) ROWS ONLY
END 
 
 