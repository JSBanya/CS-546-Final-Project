function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

const animateBanner = async () => {
	const bannerImages = [
		"banner-1.jpg", 
		"banner-2.jpg",
		"banner-3.jpg",
		"banner-4.jpg",
		"banner-5.jpg"
	];

	/*
	*	TODO: Better/smoother transition effects
	*/
	let banner = $('#banner');
	let i = 0; 
	banner.css('background-image', `url("/public/images/index/${bannerImages[i]}")`);
	while(true) {
		await sleep(6000);
		i = (i+1) % bannerImages.length;
	    banner.fadeTo(500, 0.5, function () {
	        banner.css('background-image', `url("/public/images/index/${bannerImages[i]}")`);
	        banner.fadeTo(500, 1.0);
	    });
	}
}

animateBanner();