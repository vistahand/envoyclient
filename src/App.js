import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CreateShipmentPage, HomePage } from './scenes';
import ScrollToTopButton from './constants/ScrollToTop';


const App = () => {

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/createshipment' element={<CreateShipmentPage />} />
          {/* <Route path='/products' element={<ProductsPage />} />
          <Route path='/products/:slug' element={<CategoryPage />} />
          <Route path='/products/:categorySlug/:productSlug' element={<ProductPage />} />
          <Route path='/cart' element={<CartPage />} />
          <Route path='/cart/checkout' element={<CheckoutPage />} />
          <Route path='/search' element={<SearchPage />} /> */}
        </Routes>

        <ScrollToTopButton />
      </div>
    </BrowserRouter>
  )
};

export default App;