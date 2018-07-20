# bamazon

This app was intended to create an Amazon-like storefront that takes orders from customers and depletes stock from the store's inventory. It also allows management to query inventory to find what's available, what's low in stock, and adjust as needed. 

## How it works - Customer Side

Start by running `node bamazonCustomer.js` in your terminal. Running this will first show you with a list of all items available for purchase. Then you are prompted to enter the item ID and quantity you would like to purchase.

Once the purchase has been made, the total order will be displayed on the terminal and the order will be deducted from inventory in the database. 
![image2](/readMeImages/img3.png)

## How it works - Manager Side

From the manager's perspective, you first are prompted with 4 options (after running `node bamazonManager.js` in your terminal):

![image3](/readMeImages/img4.png)

You are able to run any of the listed functions including displaying all available items and low inventory items, updating an item's inventory and adding a new item entirely. 

After each option is completed, you are prompted to return to the main menu.
