import './sass/main.scss';
import axios from 'axios';
import Notiflix from 'notiflix';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';

const KEY = '25287120-bf1334483d346d0412f62d231';
const BASE_URL = 'https://pixabay.com/api/?';
const form = document.querySelector('#search-form');
const input = document.querySelector('input');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
const imagesPerPage = 40;
let page = 1;
let inputValue = '';
let imageQuantity = 0;

const fetchImages = async (query) => {
  try {
    const response = await axios.get(
        `${BASE_URL}key=${KEY}&q=${query}
      &image_type=photo&orientation=horizontal
      &safesearch=true&per_page=${imagesPerPage}&page=${page}`,
    );
      return response;
  } catch (error) {
    console.log(error.message);
  }
};

const getImages = async event => {
    event.preventDefault();
    btnLoadMore.style.display = 'none';
    gallery.innerHTML = '';
    inputValue = input.value.trim();
    if (!inputValue) return;
    
    const data = await fetchImages(inputValue);
    imageQuantity = imagesPerPage;
    createMarkup(data);

    if (!data.data.hits.length) {
        console.log(data.data.hits.length);
        btnLoadMore.style.display = 'none';
        return;
    }

    btnLoadMore.style.display = 'block';
    btnLoadMore.style.margin = '10px auto';
    return Notiflix.Notify.success(`Hooray! We found ${data.data.totalHits} images.`);
};

form.addEventListener('submit', getImages);

const createMarkup = (data) => {
    if (data.data.hits.length === 0) {
      gallery.innerHTML = '';
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
  
  const markup = data.data.hits
    .map(card => {
        return `<a href="${card.largeImageURL}"><div class="photo-card">
                    <img src="${card.webformatURL}" alt="${card.tags}" loading="lazy" />
                    <div class="info">
                        <p class="info-item">
                        <b>Likes </b>${card.likes}
                        </p>
                        <p class="info-item">
                        <b>Views </b>${card.views}
                        </p>
                        <p class="info-item">
                        <b>Comments </b>${card.comments}
                        </p>
                        <p class="info-item">
                        <b>Downloads </b>${card.downloads}
                        </p>
                    </div>
                    </div></a>`;
    })
    .join('');
    gallery.insertAdjacentHTML('beforeend', markup);
    let simpleLightbox = new SimpleLightbox('.gallery a');
}

const loadMoreImages = async event => {
    page += 1;
    const data = await fetchImages(inputValue, page);
    createMarkup(data);
    imageQuantity += imagesPerPage;
    if (imageQuantity >= data.data.totalHits) {
        btnLoadMore.style.display = "none";
        return Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
    } 
};

btnLoadMore.addEventListener('click', loadMoreImages);
