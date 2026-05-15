import React from 'react';

const AvisPage = () => {
    return (
        <div className="min-h-screen py-12 bg-gray-light">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white-pure rounded-3xl p-8 shadow-sm">
              <h2 className="text-3xl font-bold mb-4">📝 Donner votre avis</h2>
              <p className="text-gray-dark mb-6">Partagez votre expérience et aidez-nous à progresser.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-light p-4">
                  <p className="text-sm text-gray-dark">Votre avis est précieux.</p>
                </div>
                <div className="rounded-2xl border border-gray-light p-4">
                  <p className="text-sm text-gray-dark">Merci de prendre quelques instants pour nous noter.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
};

export default AvisPage;