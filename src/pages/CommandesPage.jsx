import React from 'react';
import { Link } from 'react-router-dom';

const CommandesPage = () => {
    return (
        <div className="min-h-screen py-12 bg-gray-light">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white-pure rounded-3xl p-8 shadow-sm">
              <h2 className="text-3xl font-bold mb-4">📋 Mes Commandes</h2>
              <p className="text-gray-dark mb-6">Liste de vos commandes et statuts.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-light p-4">
                  <h3 className="font-semibold">Aucune commande</h3>
                  <p className="text-sm text-gray-dark">Votre historique sera affiché ici.</p>
                </div>
                <div className="rounded-2xl border border-gray-light p-4">
                  <p className="text-sm text-gray-dark">Retournez au menu pour commander.</p>
                  <Link to="/menu" className="btn-primary mt-4 inline-block">Voir le menu</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
};

export default CommandesPage;