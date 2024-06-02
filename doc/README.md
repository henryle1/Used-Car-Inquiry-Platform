
# Car Price Information System

## Project Summary

Our project is trying to develop a comprehensive car price information system. This system can provide a one-stop solution that allows users to easily access, manage, and compare price information for various car makes and models. Through this system, users can not only search for existing car prices but also add price information for new vehicles or delete outdated models. Core features of the system include an intuitive search interface, an administrative interface for adding or removing vehicle information, and an after-tax price calculator to help users calculate the full cost of purchasing a specific car.

This system which can improve user experience, it will start with a simple and easy-to-use registration and login interface. New users can create an account by providing basic information such as email address, username, and password while existing users can log in using their credentials.  Once logged in, users will be able to access the system's main functions, including search and management of car information, and calculation of after-tax prices.


## Description of the Application

Our project was designed to solve the problem of being able to collect information when car buyers are faced with visiting multiple websites before purchasing a car. Our goal is to simplify the user's search and decision-making process by providing a centralized information platform. In this system, we provide a calculator that allows users to calculate the price after tax. The feature has been further enhanced to give users instant access to a comprehensive cost estimate, including taxes and fees, allowing them to make more informed decisions when buying a car. By implementing these features, we hope to provide users with a transparent and comparable experience when purchasing a vehicle. Through the registration and login functions, the system can provide users with a personalized experience. It can also protect the security of user data and ensure that users can manage their information with peace of mind.

## Usefulness Description

Our application is useful because it simplifies the process of searching for cars. By typing the brands, models, and prices, users can get the results they want. One similar website is Carvana, which has similar functions as our application. The difference is that there is a calculator in our application. The calculator allows users to get the total price after tax by typing the price and zip code. This calculator is useful since some buyers have limited budgets for purchasing cars. They need to know the approximate total price to determine whether they can afford the car. Thus, this difference in our application would be helpful for those buyers.

## Data Sources Description

Our dataset encompasses a comprehensive compilation of vehicle listings from multiple regions, incorporating detailed attributes such as make, model, year, engine specifications, mileage, and price. This data, available in a CSV format and comprising 206 rows (cardinality) and 26 columns (degree), has been meticulously curated from a Kaggle-selected collection of datasets, offering an authentic snapshot of the current car market. The dataset is sourced from: https://www.kaggle.com/datasets/hellbuoy/car-price-prediction . Ultimately, this dataset mirrors real-market scenarios, providing users with valuable insights for both buying and selling vehicles, enhancing the real-world applicability of our analytics platform. 

The dataset is sourced from: https://www.kaggle.com/datasets/nehalbirla/vehicle-dataset-from-cardekho/data. This dataset is hosted on Kaggle and sourced from CarDekho, which is a popular car search venture. The dataset is in CSV format which is easy for us to make analysis. There are 4341 rows and 8 columns in this dataset, which contains detailed car information, such as price, year, selling type, etc.   

The dataset is also sourced from the Tax Foundation (https://taxfoundation.org/data/all/state/2023-sales-tax-rates-midyear/) provides an extensive dataset in an XLSX format, encapsulating the 2023 midyear sales tax rates across various U.S. states and localities, with a size of 51 rows and 7 columns. This dataset offers a detailed view on tax policies, capturing both state-level and local sales tax rates, essential for understanding the tax implications on vehicle pricing and purchase decisions across the United States.

We have a dataset created by ourselves using information on https://www.goodcarbadcar.net/2023-us-vehicle-sales-figures-by-model/ to get sales ranking of cars and make recommendations for users. 


## Functionality Description

Users can create a wish list of the cars they are interested in or want to buy. Users can add any cars on the website to their wish list or delete if theydelete them if they don’t like them. Moreover, there is a search bar on the main page where users can find cars they want by typing keywords like the car name(Toyota corona), brand, or model. Users can also use the filter to better and efficiently search the car they want. 

To help users make decisions on which car they would like to buy, we have a calculator for the tax and other fees based on the price of the car and the state users. Users can find the best car within their budget. The extra function we would do is that the application will recommend a few cars based on the information of the user's wishlist and the top sales rank dataset.   



## Low-fidelity UI Mockup

For a detailed UI mockup overview, visit [Figma](https://www.figma.com/file/Kfug2I0dM54yY9TGpsqvwY/Untitled?type=design&node-id=1%3A148&mode=dev&t=p5ffvEQHQJcwYqGq-1). 

![img](System.jpg)In the first column is our sign in and registration part. Since we provide the functionality of creating a wish list, the registration function is necessary. The second column demonstrates our design for the search interface and the wish list part. There are filters for different attributes such as make, model, year, engine specifications, mileage, and price, which makes it easier for users to find their favorite cars. The third column contains our innovation point, the calculator for the tax and other fees based on the price of the car and the state users. This calculator is shown directly in the search interface, after the users click on each car, which brings great convenience and encourages the users to search through our system.

## Project Work Distribution

### Backend Area
- **Xinming Zhai & Hanxuan Zhang**
  - Responsibilities: Develop server-side logic, database management, and application integration.

### Frontend Area
- **Henry Li & Jingye Lin**
  - Responsibilities: Design and develop the user interface and experience, ensure cross-platform compatibility, and implement front-end logic.
