// eslint-disable-next-line no-unused-vars
import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <h2 className="text-lg mb-6">
                We&#39;re sorry, but the page you requested could not be found. Please go back to the homepage.
            </h2>
            <Link
                to="/"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800"
            >
                Back Home
            </Link>
        </div>
    );
}
