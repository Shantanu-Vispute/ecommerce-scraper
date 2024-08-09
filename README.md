# DealRadar

DealRadar is an e-commerce product price tracker that allows users to set price alerts for their favorite products. It automatically sends email notifications for price drops, back-in-stock alerts, and more. The application is built using Next.js, MongoDB, and web-scraping techniques, with automated data updates managed by cron jobs.

## Features

- **Price Tracking**: Users can track the prices of products and set up alerts for specific price points.
- **Email Notifications**: Receive notifications for various scenarios including:
  - Price drops
  - Back-in-stock alerts
  - Lowest price notifications
- **Automated Web Scraping**: Periodic scraping of product prices from e-commerce websites to ensure data accuracy.
- **Cron Jobs**: Scheduled tasks to automatically update product prices and notify users.

## Technologies Used

- **Next.js**: A React framework for building server-side rendered applications.
- **Web-Scraping**: Used to gather product pricing data from e-commerce websites.
- **MongoDB**: NoSQL database for storing product data and user preferences.
- **Cron**: Automated task scheduling for periodic web scraping and email notifications.

## Setup and Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/DealRadar.git
    cd DealRadar
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up environment variables:

    Create a `.env.local` file in the root directory and add the necessary environment variables:

    ```env
    MONGODB_URI=your_mongodb_connection_string
    EMAIL_SERVICE_API_KEY=your_email_service_api_key
    ```

4. Start the development server:

    ```bash
    npm run dev
    ```

5. (Optional) To run the cron jobs for web scraping and notifications, ensure that your server is running and the cron jobs are properly configured in the codebase.

## Usage

- Navigate to the website, enter the product URL you wish to track, and set your desired price alert.
- DealRadar will send you an email when the price drops to or below your specified amount.
- Manage your alerts and view tracked products from your user dashboard.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. **Fork the Project**: Create a copy of this repository on your GitHub account.
2. **Create your Feature Branch**:
    ```bash
    git checkout -b feature/AmazingFeature
    ```
3. **Commit your Changes**:
    ```bash
    git commit -m 'Add some AmazingFeature'
    ```
4. **Push to the Branch**:
    ```bash
    git push origin feature/AmazingFeature
    ```
5. **Open a Pull Request**: Navigate to the original repository on GitHub and open a pull request to merge your feature branch.

We appreciate your contributions and efforts to improve SharePlay!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
