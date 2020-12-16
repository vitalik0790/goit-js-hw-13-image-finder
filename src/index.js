import { refs } from './js/refs';
import imagesCardTpl from './templates/templates.hbs';
import debounce from 'lodash.debounce';
import PixabayApiServise from './js/apiService';
import { onClickImage } from './js/modal-img';
import './styles.scss';

const pixabayApiServise = new PixabayApiServise();

refs.input.addEventListener('input', debounce(onSearchInputChange, 500));
refs.input.addEventListener('submit', preventtDefault)
refs.outputList.addEventListener('click', onClickImage);

function preventtDefault(event) {
    event.preventDefault();
}

function onSearchInputChange({ target }) {
    pixabayApiServise.query = target.value;
    if (pixabayApiServise.query === '') {
        clearArticlesList();
        return;
    }

    clearArticlesList();
    pixabayApiServise.resetPage();
    fetchToPixabayApiAndRender();
}

function fetchToPixabayApiAndRender() {
    pixabayApiServise.fetchImages().then(appendImagesMarkup);
}

function appendImagesMarkup({ hits }) {
    refs.outputList.insertAdjacentHTML('beforeend', imagesCardTpl(hits));
}

function clearArticlesList() {
    refs.outputList.innerHTML = '';
}

//infinite scroll settings

const intersectionCallback = entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting && pixabayApiServise.query !== '') {
            fetchToPixabayApiAndRender();
        }
    });
};

const intersectionOptions = {
    rootMargin: '0% 0% 10% 0%',
};

const observer = new IntersectionObserver(
    intersectionCallback,
    intersectionOptions,
);

observer.observe(refs.watcher);