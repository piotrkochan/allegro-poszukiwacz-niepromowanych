export const getRegularOfferHeaderElement = doc => {
  return Array.from(doc.querySelectorAll('h2'))
    .filter(x => x.textContent === 'Oferty');
};

export const containsRegularOffers = doc => {
  return getRegularOfferHeaderElement(doc).length > 0;
};

export const containsOffers = (doc) => doc.querySelectorAll('#opbox-listing--base,.opbox-listing--base').length > 0;