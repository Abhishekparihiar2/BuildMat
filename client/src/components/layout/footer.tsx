export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4" data-testid="text-brand">
              <i className="fas fa-hard-hat mr-2"></i>MaterialMart
            </h3>
            <p className="opacity-90" data-testid="text-description">
              Connecting construction material owners with seekers for a sustainable building future.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4" data-testid="text-buyers-heading">For Buyers</h4>
            <ul className="space-y-2 opacity-90">
              <li><a href="#" className="hover:underline" data-testid="link-browse-materials">Browse Materials</a></li>
              <li><a href="#" className="hover:underline" data-testid="link-search-category">Search by Category</a></li>
              <li><a href="#" className="hover:underline" data-testid="link-local-listings">Local Listings</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4" data-testid="text-sellers-heading">For Sellers</h4>
            <ul className="space-y-2 opacity-90">
              <li><a href="#" className="hover:underline" data-testid="link-list-materials">List Materials</a></li>
              <li><a href="#" className="hover:underline" data-testid="link-manage-listings">Manage Listings</a></li>
              <li><a href="#" className="hover:underline" data-testid="link-seller-guidelines">Seller Guidelines</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4" data-testid="text-support-heading">Support</h4>
            <ul className="space-y-2 opacity-90">
              <li><a href="#" className="hover:underline" data-testid="link-help-center">Help Center</a></li>
              <li><a href="#" className="hover:underline" data-testid="link-safety-tips">Safety Tips</a></li>
              <li><a href="#" className="hover:underline" data-testid="link-contact-us">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white border-opacity-20 mt-8 pt-8 text-center opacity-90">
          <p data-testid="text-copyright">&copy; 2024 MaterialMart. All rights reserved. Built for sustainable construction.</p>
        </div>
      </div>
    </footer>
  );
}
