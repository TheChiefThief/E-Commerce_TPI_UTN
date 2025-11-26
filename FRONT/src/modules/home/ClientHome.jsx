import { useState, useEffect } from 'react';
import Card from '../../shared/components/Card';

const ClientHome = () => {

  if (isLoading) {
    return (
    
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-gray-500">Cargando...</p>
        </div>
     
    );
  }

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Productos</h1>
          <div className="w-full sm:w-80">
            <label htmlFor="search" className="sr-only">Buscar productos</label>
            <input
              id="search"
              type="text"
              placeholder="Buscar productos..."
              value={searchTerms}
              onChange={(e) => {
                
              }}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-12">No se encontraron productos</div>
          ) : (
            products.map((product) => (
              <Card key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))
          )}
        </div>

        <div className="mt-8">
          
        </div>
      </div>
    
  );
};

export default ClientHome;
