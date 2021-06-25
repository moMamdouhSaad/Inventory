
Company 
id,client_id,created_date,debit,credit
-------------------------------------

CREATE OR ALTER PROCEDURE Insert_Into_Client_Account
@client_id int,
@debit int
AS
BEGIN
  INSERT INTO client_account
    (client_id, debit, credit)
VALUES
    (@client_id, @debit, 0)
END 
---++++++++++++++++++++++++++++++++--
-- get all balance by id
CREATE OR ALTER PROCEDURE Get_Balance_Client_Account_By_Id
@client_id int
AS
BEGIN

  Select Sum(credit) - Sum(debit) as balance
    from client_account Where client_id = @client_id

END 

-- get all
CREATE OR ALTER PROCEDURE Get_Balance_Client
AS
BEGIN
  Select Sum(credit) - Sum(debit) as balance
    from client_account
END

-- get by client id and date range

 CREATE OR ALTER PROCEDURE Get_Client_Account_By_ClientID_And_DateRange
@client_id int, 
@from varchar(100),
@to varchar(100)
AS
BEGIN
    SELECT  Sum(credit) - Sum(debit) as balance
    FROM   client_account WHERE cast(created_date as date) BETWEEN @from AND @to
    AND client_id = @client_id;
END 

-- get client account by date range
CREATE OR ALTER PROCEDURE Get_Client_Account_By_Date_Range
@from varchar(100),
@to varchar(100)
AS
BEGIN
    SELECT Sum(credit) - Sum(debit) as balance
    FROM   client_account WHERE cast(created_date as date) BETWEEN @from AND @to;
END 
 


-- WHERE d.[Date] BETWEEN '2018-03-21' AND '2019-03-21'
