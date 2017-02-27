/**
 * Created by Ervin on 26.2.2017..
 */
window.onload = function () {

    var Carousel = function () {
        var cCreator;
        var cCollector;
        var cAnimator;
        var cMode = 'standard';
        var cGalleryHolder;
        var cRealImageHolder;
        var cThumbnailHolder;
        var imageUrls = [];
        var thumbnails = [];

        var init = function(mode){

            if(null != mode){
                cMode = mode;
            }

            if(null == cCreator){
                throw 'Creator class must be set.';
            }

            if(null == cCollector){
                throw 'Collector class must be set.';
            }

            getGalleryElements();
            placeGalleryElements();
            imageUrls = cCollector.collectImages();
            placeThumbnails();
            placeFirstImage();
        };

        var setCreator = function (creator) {
            cCreator = creator;
        };

        var setCollector = function (collector) {
            cCollector = collector;
        };

        var setAnimator = function (animator) {
            cAnimator = animator;
        };

        var getGalleryElements = function () {
            cGalleryHolder = cCreator.createGalleryHolder();
            cRealImageHolder = cCreator.createRealImageHolder();
            cThumbnailHolder = cCreator.createThumbnailHolder();
        };

        var placeGalleryElements = function () {
            cGalleryHolder.appendChild(cRealImageHolder);
            cGalleryHolder.appendChild(cThumbnailHolder);
            document.body.appendChild(cGalleryHolder);

        };

        var placeFirstImage = function () {
            var src = imageUrls[0];
            var thumbnail = thumbnails[0];
            var img = cCreator.createRealImage(src);
            placeImage(img);
            setActiveThumbnail(thumbnail);

        };

        var placeThumbnails = function () {
            imageUrls.forEach(function (element) {
                var thumb = cCreator.createThumbnailElement(element);
                addEventListener(thumb);
                thumbnails.push(thumb);
                cThumbnailHolder.appendChild(thumb);
            })
        };

        var placeImage = function (img) {
            cAnimator.init(cRealImageHolder,img,'fancy2');
        };

        var onclickPopulateRealImage = function (element) {

            var thumbnail = element.target;
            var src = thumbnail.getAttribute('data');
            var img = cCreator.createRealImage(src);

            placeImage(img);
            setActiveThumbnail(thumbnail);
        };


        var setActiveThumbnail = function(element){
            thumbnails.forEach(function (thumbnail) {
                thumbnail.classList.remove('active');
            });
            element.classList.add('active');
        };

        var addEventListener = function (element) {
            element.addEventListener('click',onclickPopulateRealImage);
        };

        return {
            init:init,
            setCreator:setCreator,
            setCollector:setCollector,
            setAnimator:setAnimator
        };
    }();

    var Creator = function () {

        var createGalleryHolder = function(){

            var cGalleryBackground = createGalleryBackground();
            var cGalleryHolder = document.createElement("div");
            cGalleryHolder.setAttribute('class','cGalleryHolder');
            cGalleryHolder.style.position = 'relative';
            cGalleryHolder.appendChild(cGalleryBackground);

            return cGalleryHolder;
        };

        var createGalleryBackground = function () {

            var cGalleryBackground = document.createElement("div");
            cGalleryBackground.setAttribute('class','cGalleryBackground');
            cGalleryBackground.style.position = 'absolute';
            cGalleryBackground.style.width = '100%';
            cGalleryBackground.style.height = '100%';
            cGalleryBackground.style.backgroundColor = '#cac8c8';
            cGalleryBackground.style.borderRadius = '10px';
            cGalleryBackground.style.opacity = '.7';
            cGalleryBackground.style.zIndex = 0;

            return cGalleryBackground;
        };

        var createRealImageHolder = function(){

            var realImageHolder = document.createElement("div");
            realImageHolder.setAttribute('class','cRealImageHolder');
            realImageHolder.style.position = 'relative';

            return realImageHolder;
        };

        var createRealImage = function (src) {

            var img = document.createElement("img");
            img.setAttribute('src', src);
            img.style.width ='100%';

            return img;
        };

        var createThumbnailHolder = function () {

            var cThumbnailHolder = document.createElement("div");
            cThumbnailHolder.setAttribute('class','cThumbnailHolder');
            cThumbnailHolder.style.position = 'relative';
            cThumbnailHolder.style.height = '30px';
            cThumbnailHolder.style.padding = '5px 15px 15px 15px';

            return cThumbnailHolder;
        };

        var createThumbnailElement = function (element) {

            var cHolder = document.createElement("div");
            cHolder.setAttribute('class','cThumbnail');
            cHolder.style.position = 'relative';
            cHolder.setAttribute('data',element);
            cHolder.style.backgroundImage = "url('"+element+"')";

            return cHolder;
        };

        return {
            createGalleryHolder:createGalleryHolder,
            createGalleryBackground:createGalleryBackground,
            createRealImageHolder:createRealImageHolder,
            createRealImage:createRealImage,
            createThumbnailHolder:createThumbnailHolder,
            createThumbnailElement:createThumbnailElement
        };
    };

    var Collector = function () {
        
        var tags = document.getElementsByClassName('imageCollection')[0].children;
        var imageUrls = [];

        var collectImages = function() {
            for(var i=0; i<=tags.length-1;i++){
                imageUrls.push(tags[i].getAttribute('href'));
            }
            return imageUrls;
        };

        return {collectImages:collectImages};
    };
    
    var Animator = function () {
        var aImageHolder;
        var aImg;

        var init = function (imageHolder,img,mode) {

            aImageHolder = imageHolder;
            aImg = img;
            aImg.onload = function () {
                switch (mode){
                    case 'standard':
                        standard();
                        break;
                    case 'fancy':
                        fancy();
                        break;
                    case 'fancy2':
                        fancy2();
                        break;
                    default:
                        standard();
                        break;
                }
            };
        };

        var standard = function () {

            var currentImage = aImageHolder.children;

            aImg.classList.add('new');
            aImg.classList.add('standard');

            if(currentImage.length>0){
                currentImage[0].classList.remove('current');
                currentImage[0].classList.add('new');
            }

            aImageHolder.appendChild(aImg);

            setHolderHeight(aImg);

            aImg.classList.remove('new');
            aImg.classList.add('current');

            removeElement();
        };

        var fancy = function () {

            var currentImage = aImageHolder.children;

            aImg.classList.add('new');
            aImg.classList.add('fancy');

            if(0!=currentImage.length){
                currentImage[0].classList.remove('new');
                currentImage[0].classList.remove('top');
                currentImage[0].classList.add('bottom');
            }

            aImageHolder.appendChild(aImg);
            setHolderHeight(aImg);

            aImg.classList.remove('new');
            aImg.classList.add('top');

            removeElement();
        };

        var fancy2 = function () {

            aImg.classList.add('new');
            aImg.classList.add('fancy2');

            var currentImage = aImageHolder.children;

            if(0!=currentImage.length){
                currentImage[0].classList.remove('new');
                currentImage[0].classList.remove('top');
                currentImage[0].classList.add('bottom');

            }

            aImageHolder.appendChild(aImg);
            
            setHolderHeight(aImg);

            aImg.classList.remove('new');
            aImg.classList.add('top');

            removeElement();
        };

        var removeElement = function () {

            var currentImage = aImageHolder.children;

            setTimeout(function () {

                if(currentImage.length>1) {
                    if (typeof currentImage[0].remove == 'function') {
                        currentImage[0].remove()
                    }
                    else {
                        currentImage[0].outerHTML = '';
                    }
                }
            },1000)
        };

        var setHolderHeight = function (newImage) {

            var newHeight = getHeight(newImage);

            aImageHolder.style.height = newHeight+'px';
        };

        var getHeight = function (img) {
            var imgHeight = img.height;
            var imgWidth = img.width;

            return imgHeight/(imgWidth/560);
        };
        return {init:init};
    };

    Carousel.setCreator(new Creator());
    Carousel.setCollector(new Collector());
    Carousel.setAnimator(new Animator());
    Carousel.init();


};