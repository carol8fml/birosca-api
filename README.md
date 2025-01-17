# **Birosca API**

An API for inventory management for small businesses. This project allows users to add, remove, and list products in a simple and efficient way.

## **Features**
- Add products to the inventory.
- List all available products.
- Update product information.
- Remove products from the inventory.
- Interactive API documentation with Swagger.

## **Technologies**
- **Node.js** with **NestJS**.
- **SQLite** as the database.
- **Swagger** for API documentation.
- **TypeScript** for strongly typed development.

## **How to Use**

### **1. Clone the Repository**
```bash
git clone https://github.com/carol8fml/birosca-api.git
cd birosca-api
```

### **2. Install Dependencies**
Make sure you have Node.js and Yarn installed. Then, run:
```bash
yarn install
```

### **3. Run the Project**
To start the development server:
```bash
yarn start:dev
```

The API will be available at: `http://localhost:3000`

### **4. Access the Documentation**
Explore the Swagger documentation at:
```text
http://localhost:3000/api
```

## **Useful Commands**
- **Start the development server**: `yarn start:dev`
- **Build the project**: `yarn build`
- **Run tests**: `yarn test`

## **Project Structure**
```text
src/
├── api/                   # API Controllers
│   └── products/          # Products Controller
├── config/                # Global configurations
├── entities/              # Domain entities
├── repositories/          # Repository implementations and interfaces
├── usecases/              # Business logic use cases
└── main.ts                # Application entry point
```

## Author
Carolina Gonçalves

<a href="https://www.linkedin.com/in/carolina-gon%C3%A7alves-a23689198">![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)</a>
<a href="https://mail.google.com/mail/?view=cm&fs=1&to=contato.devcarolina@gmail.com">![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)</a>


## **Contributing**
Feel free to submit pull requests or open issues to contribute to this project.

## **License**
This project is licensed under the **MIT License**.
