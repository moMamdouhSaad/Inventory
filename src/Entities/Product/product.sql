Product 
id,name,description,is_active,deleted

CREATE TABLE Company (
    id INT PRIMARY KEY IDENTITY (1, 1),
    barcode VARCHAR (255), 
    name VARCHAR (100) NOT NULL,
    description VARCHAR (255),
    stock_qty int NOT NULL,
    price int NOT NULL,
    deleted BIT NOT NULL DEFAULT 0,
    is_active BIT NOT NULL DEFAULT 1,
    company_id int NOT NULL,
    category_id int NOT NULL,
	FOREIGN KEY (company_id) REFERENCES  company(id),
    FOREIGN KEY (category_id) REFERENCES  category(id),
);