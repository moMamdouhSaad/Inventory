Sales Table
id (auto)
order_date (auto)
customer_id (input)
sub_total (auto)
discount_rate (input)
discount_value (auto)
tax_rate (input)
tax_value (auto)
total_price (auto);


CREATE TABLE sale_order (
    id INT PRIMARY KEY IDENTITY (1, 1),
    order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    client_id int NOT NULL,
    sub_total int NOT NULL,
    discount_rate int NOT NULL DEFAULT 0 ,
    discount_value int NOT NULL DEFAULT 0,
    tax_rate int NOT NULL DEFAULT 0,
    tax_value int NOT NULL DEFAULT 0,
    total_price int NOT NULL,
    FOREIGN KEY (client_id) REFERENCES  client(id),
);

CREATE OR ALTER PROCEDURE Insert_Into_Sale_Order_AND_Client_Account

 @client_id int,
 @sub_total int ,
 @discount_rate int,
 @discount_value int,
 @tax_rate int,
 @tax_value int,
 @total_price int,
 @debit int,
BEGIN

    INSERT  INTO sale_order
     (client_id,sub_total, discount_rate,discount_value,tax_rate,tax_value,total_price)
    VALUES
     (@client_id,@sub_total, @discount_rate,@discount_value,@tax_rate,@tax_value,@total_price)


     INSERT INTO client_account
    (client_id, debit, credit)
VALUES
    (@client_id, @debit, @total_price)
END




client_account Table
id,client_id,date,debit(dafa3 money), credit(take products-total-price)

CREATE TABLE client_account (
    id INT PRIMARY KEY IDENTITY (1, 1),
    client_id int NOT NULL,
    created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    debit int NOT NULL DEFAULT 0,
    credit int NOT NULL DEFAULT 0,
    FOREIGN KEY (client_id) REFERENCES  client(id),
);




sale_order_line Table
order_id, product_id ,qty, sale_price_per_item, Total 

CREATE TABLE sale_order_line (
    id INT PRIMARY KEY IDENTITY (1, 1),
    order_id int NOT NULL,
    product_id int NOT NULL,
    qty int NOT NULL,
    sale_price int NOT NULL,
    total_price int NOT NULL,
    FOREIGN KEY (order_id) REFERENCES  sale_order(id),
    FOREIGN KEY (product_id) REFERENCES  product(id),
);
CREATE OR ALTER PROCEDURE Insert_Sale_Order_Line
 @order_id int = IDENT_CURRENT( 'sale_order' ),
 @product_id int,
 @qty int,
 @sale_price int,
 @total_price int,
AS
BEGIN
    INSERT  INTO sale_order
     (order_id,product_id, qty,sale_price,total_price)
    VALUES
     (@order_id,@product_id, @qty,@sale_price,@total_price)
END


-- get all
CREATE OR ALTER PROCEDURE Get_All_Sale_Order
AS
BEGIN
  Select * from sale_order 
 END

-- get sale order line by id
CREATE OR ALTER PROCEDURE Get_Sale_Order_Lines_By_OderId
 @id INT
AS
BEGIN
  Select p.name as product_name,SOL.qty,uom.name as uom_name, SOL.sale_price,SOL.total_price from sale_order_line as SOL 
  join product  p on SOL.product_id = p.id JOIN uom on p.uom_id = uom.id
  where SOL.order_id = @id AND p.deleted =0
 END

-- get sale order by id
 CREATE OR ALTER PROCEDURE Get_Sale_Order_By_ID
@id INT
AS
BEGIN
    SELECT *
    FROM   sale_order
    WHERE  id = @id;
END


 


 
