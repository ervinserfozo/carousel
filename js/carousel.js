/**
 * Created by Ervin on 26.2.2017..
 */
window.onload = function () {

    var Carousel = function () {
        var cCreator;
        var cCollector;
        var cAnimator;
        var cRotator;
        var cMode = 'standard';
        var cGalleryHolder;
        var cRealImageHolder;
        var cThumbnailHolder;
        var cProgressBar;
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

        var setRotator = function (rotator) {
            cRotator = rotator;
        };

        var getGalleryElements = function () {
            cGalleryHolder = cCreator.createGalleryHolder();
            cRealImageHolder = cCreator.createRealImageHolder();
            cThumbnailHolder = cCreator.createThumbnailHolder();
            cProgressBar = cCreator.createProgressBar()
        };

        var placeGalleryElements = function () {
            cGalleryHolder.appendChild(cRealImageHolder);
            addEventListeners();
            cGalleryHolder.appendChild(cProgressBar);
            cGalleryHolder.appendChild(cThumbnailHolder);
            document.body.appendChild(cGalleryHolder);

        };

        var placeFirstImage = function () {
            var src = imageUrls[0];
            var thumbnail = thumbnails[0];
            var img = cCreator.createRealImage(src);
            placeImage(img);
            setActiveThumbnail(thumbnail);
            cRotator.clockWise(thumbnails,thumbnail)

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
            cAnimator.init(cProgressBar,cRealImageHolder,img,'fancy2');
        };

        var onclickPopulateRealImage = function (element) {

            var thumbnail = element.target;
            var src = thumbnail.getAttribute('data');
            var img = cCreator.createRealImage(src);

            placeImage(img);
            setActiveThumbnail(thumbnail);

            cRotator.clockWise(thumbnails,thumbnail);
        };


        var setActiveThumbnail = function(element){
            thumbnails.forEach(function (thumbnail) {
                thumbnail.classList.remove('active');
            });
            element.classList.add('active');
        };

        var addEventListener = function (element) {
            element.addEventListener('click',onclickPopulateRealImage);
            element.addEventListener('mouseover',cRotator.stopRotation);
            element.addEventListener('mouseout',cRotator.startRotator);
        };

        var addEventListeners = function () {

            cRealImageHolder.addEventListener('mouseover',cRotator.stopRotation);
            cRealImageHolder.addEventListener('mouseout',cRotator.startRotator);
        };

        return {
            init:init,
            setCreator:setCreator,
            setCollector:setCollector,
            setAnimator:setAnimator,
            setRotator:setRotator
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
            cGalleryBackground.style.zIndex = -1;

            return cGalleryBackground;
        };

        var createProgressBar = function () {
            var cProgressBar = document.createElement("div");
            cProgressBar.setAttribute('class','cProgressBar');
            cProgressBar.style.height = '2px';
            cProgressBar.style.backgroundColor = '#0cb2ff';
            document.addEventListener('intervalStart',function (){
                cProgressBar.classList.add('intervalStart');

            });
            document.addEventListener('intervalStop',function (){
                cProgressBar.classList.remove('intervalStart');
            });
            return cProgressBar;
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
            cThumbnailHolder.style.padding = '10px';

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
            createProgressBar:createProgressBar,
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
        var aProgressBar;
        var aImageHolder;
        var aImg;

        var init = function (progressBar,imageHolder,img,mode) {
            aProgressBar = progressBar;
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
            aProgressBar.classList.remove('intervalStart');

            if(currentImage.length>0){
                currentImage[0].classList.remove('current');
                currentImage[0].classList.add('new');
            }

            aImageHolder.appendChild(aImg);

            setHolderHeight(aImg);

            aImg.classList.remove('new');
            aImg.classList.add('current');
            aProgressBar.classList.add('intervalStart');

            removeElement();
        };

        var fancy = function () {

            var currentImage = aImageHolder.children;

            aImg.classList.add('new');
            aImg.classList.add('fancy');
            aProgressBar.classList.remove('intervalStart');

            if(0!=currentImage.length){
                currentImage[0].classList.remove('new');
                currentImage[0].classList.remove('top');
                currentImage[0].classList.add('bottom');
            }

            aImageHolder.appendChild(aImg);
            setHolderHeight(aImg);

            aImg.classList.remove('new');
            aImg.classList.add('top');
            aProgressBar.classList.add('intervalStart');

            removeElement();
        };

        var fancy2 = function () {

            var currentImage = aImageHolder.children;

            aImg.classList.add('new');
            aImg.classList.add('fancy2');
            aProgressBar.classList.remove('intervalStart');

            if(0!=currentImage.length){
                currentImage[0].classList.remove('new');
                currentImage[0].classList.remove('top');
                currentImage[0].classList.add('bottom');

            }

            aImageHolder.appendChild(aImg);

            setHolderHeight(aImg);

            aImg.classList.remove('new');
            aImg.classList.add('top');
            aProgressBar.classList.add('intervalStart');

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

    var Rotator = function () {
        var intervalStatus = 'started';
        var currentThumbnailIndex = 0;
        var rThumbnails;
        var interval = setInterval(clockWiseInterval,10000);

        var clockWise = function (thumbnails,currentThumbnail) {

            stopRotation();

            rThumbnails = thumbnails;
            if(currentThumbnail!=undefined) {
                currentThumbnailIndex = thumbnails.indexOf(currentThumbnail);
            }

            startRotator();
        };

        var counterClockWise = function (thumbnails,currentThumbnail) {
            /** Todo implement counterClockWise **/
        };

        var stopRotation = function () {

            if(intervalStatus=='started') {

                clearInterval(interval);
                intervalStatus = 'stopped';
                document.dispatchEvent(window['intervalStop']);
            }
        };

        var startRotator = function () {

            if(intervalStatus=='stopped') {
                
                interval = setInterval(clockWiseInterval,10000);
                intervalStatus = 'started';
                document.dispatchEvent(window['intervalStart']);
            }

        };

        var clockWiseInterval = function () {

            if(rThumbnails.length-1>=currentThumbnailIndex+1) {
                rThumbnails[currentThumbnailIndex + 1].click();
            }
            else {
                rThumbnails[0].click();
            }
        };

        return {
            clockWise:clockWise,
            startRotator:startRotator,
            stopRotation:stopRotation
        };
    };
    
    var EventGenerator = function (eventName) {

        window[eventName] = new CustomEvent(eventName);
    };

    EventGenerator('intervalStart');
    EventGenerator('intervalStop');

    
    Carousel.setCreator(new Creator());
    Carousel.setCollector(new Collector());
    Carousel.setAnimator(new Animator());
    Carousel.setRotator(new Rotator());
    Carousel.init();


};