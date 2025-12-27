import React from 'react'

function Footer() {
  return (
    <div className="overflow-x-hidden max-w-full">
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 w-full max-w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">About Us</h3>
              <p className="text-gray-400">Your trusted online destination for authentic sneakers from top brands worldwide.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="text-gray-400 space-y-2">
                <li><a href="#" className="hover:text-white">Home</a></li>
                <li><a href="#" className="hover:text-white">Sneakers</a></li>
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Customer Service</h3>
              <ul className="text-gray-400 space-y-2">
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Shipping Info</a></li>
                <li><a href="#" className="hover:text-white">Returns & Exchanges</a></li>
                <li><a href="#" className="hover:text-white">Size Guide</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <p className="text-gray-400">Email: info@sneakersoul.com</p>
              <p className="text-gray-400">Phone: 1-800-KICKS</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 SneakerSoul. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
