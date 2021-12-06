(function($) {
   'use strict'
        var isMobile = {
            Android: function() {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function() {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function() {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function() {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function() {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function() {
                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
            }
        }; // is Mobile

        var responsiveMenu = function() {
            var menuType = 'desktop';

            $(window).on('load resize', function() {
                var currMenuType = 'desktop';

                if ( matchMedia( 'only screen and (max-width: 991px)' ).matches ) {
                    currMenuType = 'mobile';
                }

                if ( currMenuType !== menuType ) {
                    menuType = currMenuType;

                    if ( currMenuType === 'mobile' ) {
                        var $mobileMenu = $('#mainnav').attr('id', 'mainnav-mobi').hide();
                        var hasChildMenu = $('#mainnav-mobi').find('ul.menu').children('li');
                        var hasSubmenuChild = $('.submenu').find('li.has-submenu-child');

                        $('#header').after($mobileMenu);
                        hasChildMenu.children('div.submenu').hide();
                        $(".menu-mega").hide();
                        hasChildMenu.children('a').after('<span class="btn-submenu"></span>');
                        $('.btn-menu').removeClass('active');
                        $('.submenu-child').hide();
                        hasSubmenuChild.children('a').after('<span class="btn-submenu-child"></span>');

                    } else {
                        var $desktopMenu = $('#mainnav-mobi').attr('id', 'mainnav').removeAttr('style');
                        $('div.submenu').show();
                        $desktopMenu.find('.menu-mega').removeAttr('style');
                        $('#header').find('.nav-wrap').append($desktopMenu);
                        $('.btn-submenu').remove();
                        $('.submenu-child').show();
                    }

                    if ($('#header').hasClass('style1') || $('#header').hasClass('style2 v1')) {
                        $('#mainnav-mobi').css({
                            // top: '100px'
                        });
                    }
                }
            });

            $('.btn-menu').on('click', function() {         
                $('#mainnav-mobi').slideToggle(300);
                $(this).toggleClass('active');
                return false;
            });

            $(document).on('click', '#mainnav-mobi li .btn-submenu', function(e) {
                $(this).toggleClass('active').next('.submenu').slideToggle(500);
                $(this).next('.menu-mega').slideToggle(500);
                e.stopImmediatePropagation();
                return false;
            });

            $(document).on('click', '#mainnav-mobi li .submenu .btn-submenu-child', function(e) {
                $(this).toggleClass('active').next('ul.submenu-child').slideToggle(500);
                // $(this).next('.menu-mega').slideToggle(500);
                e.stopImmediatePropagation();
                return false;
            });
        }; // Responsive Menu

        var menuCanvas = function() {
            var buttonCavas = $('.box-canvas i.fa-bars');
            var closeCanvas = $('.menu-canvas .close');
            buttonCavas.on('click', function() {
                $(this).closest('section').children('.menu-canvas').css({
                    opacity: '1',
                    visibility: 'visible',
                    right: '0'
                });
            });

            closeCanvas.on('click', function() {
                $(this).parent('.menu-canvas').css({
                    opacity: '0',
                    visibility: 'hidden',
                    right: '-520px',
                });
            });
        }; // Menu Canvas

    // Dom Ready
    $(function() {
        responsiveMenu();
        menuCanvas();

    });

})(jQuery);

$(".skill-per").each(function() {
    var $this = $(this);
    var per = $this.attr("per");
    $this.css("width", per + "%");
    $({ animatedValue: 0 }).animate(
        { animatedValue: per },
        {
            duration: 1000,
            step: function() {
                $this.attr("per", Math.floor(this.animatedValue) + "%");
            },
            complete: function() {
                $this.attr("per", Math.floor(this.animatedValue) + "%");
            }
        }
    );
});

$(function() {
    var playerTrack = $("#player-track"), bgArtwork = $('#bg-artwork'), bgArtworkUrl, albumName = $('#album-name'), trackName = $('#track-name'), albumArt = $('#album-art'), sArea = $('#s-area'), seekBar = $('#seek-bar'), trackTime = $('#track-time'), insTime = $('#ins-time'), sHover = $('#s-hover'), playPauseButton = $("#play-pause-button"), i = playPauseButton.find('i'), tProgress = $('#current-time'), tTime = $('#track-length'), seekT, seekLoc, seekBarPos, cM, ctMinutes, ctSeconds, curMinutes, curSeconds, durMinutes, durSeconds, playProgress, bTime, nTime = 0, buffInterval = null, tFlag = false, albums = ['Setareh', 'Alamat soal', 'Vaghti ke bad misham', 'Breaking me', 'Why am I so in love'], trackNames = ['Shadmehr Aghili', 'Shadmehr Aghili', 'Shadmehr Aghili', 'Topic', 'XXXTENTACION'], albumArtworks = ['_1', '_2', '_3', '_4', '_5'], trackUrl = ['https://dl.nitmusic.com/1399/02/Shadmehr%20Aghili%20-%20Setareh.mp3', 'https://dl.aharmusic.ir/98/4/19/Shadmehr%20Aghili%20-%20Alamate%20Soal.mp3', 'https://dl.nex1.ir/5/Shadmehr-Aghili_Vaghti-Ke-Bad-Misham.mp3', 'https://dl.baarzesh.net/music/2020/7/Topic_Breaking_Me_Remix_128.mp3', 'https://dl.baarzesh.net/music/2020/10/XXXTENTACION_the_remedy_for_a_broken_heart_320.mp3'], playPreviousTrackButton = $('#play-previous'), playNextTrackButton = $('#play-next'), currIndex = -1;
    function playPause() {
        setTimeout(function() {
            if (audio.paused) {
                playerTrack.addClass('active');
                albumArt.addClass('active');
                checkBuffering();
                i.attr('class', 'fas fa-pause');
                audio.play();
            } else {
                playerTrack.removeClass('active');
                albumArt.removeClass('active');
                clearInterval(buffInterval);
                albumArt.removeClass('buffering');
                i.attr('class', 'fas fa-play');
                audio.pause();
            }
        }, 300);
    }
    function showHover(event) {
        seekBarPos = sArea.offset();
        seekT = event.clientX - seekBarPos.left;
        seekLoc = audio.duration * (seekT / sArea.outerWidth());
        sHover.width(seekT);
        cM = seekLoc / 60;
        ctMinutes = Math.floor(cM);
        ctSeconds = Math.floor(seekLoc - ctMinutes * 60);
        if ((ctMinutes < 0) || (ctSeconds < 0))
            return;
        if ((ctMinutes < 0) || (ctSeconds < 0))
            return;
        if (ctMinutes < 10)
            ctMinutes = '0' + ctMinutes;
        if (ctSeconds < 10)
            ctSeconds = '0' + ctSeconds;
        if (isNaN(ctMinutes) || isNaN(ctSeconds))
            insTime.text('--:--');
        else
            insTime.text(ctMinutes + ':' + ctSeconds);
        insTime.css({
            'left': seekT,
            'margin-left': '-21px'
        }).fadeIn(0);
    }
    function hideHover() {
        sHover.width(0);
        insTime.text('00:00').css({
            'left': '0px',
            'margin-left': '0px'
        }).fadeOut(0);
    }
    function playFromClickedPos() {
        audio.currentTime = seekLoc;
        seekBar.width(seekT);
        hideHover();
    }
    function updateCurrTime() {
        nTime = new Date();
        nTime = nTime.getTime();
        if (!tFlag) {
            tFlag = true;
            trackTime.addClass('active');
        }
        curMinutes = Math.floor(audio.currentTime / 60);
        curSeconds = Math.floor(audio.currentTime - curMinutes * 60);
        durMinutes = Math.floor(audio.duration / 60);
        durSeconds = Math.floor(audio.duration - durMinutes * 60);
        playProgress = (audio.currentTime / audio.duration) * 100;
        if (curMinutes < 10)
            curMinutes = '0' + curMinutes;
        if (curSeconds < 10)
            curSeconds = '0' + curSeconds;
        if (durMinutes < 10)
            durMinutes = '0' + durMinutes;
        if (durSeconds < 10)
            durSeconds = '0' + durSeconds;
        if (isNaN(curMinutes) || isNaN(curSeconds))
            tProgress.text('00:00');
        else
            tProgress.text(curMinutes + ':' + curSeconds);
        if (isNaN(durMinutes) || isNaN(durSeconds))
            tTime.text('00:00');
        else
            tTime.text(durMinutes + ':' + durSeconds);
        if (isNaN(curMinutes) || isNaN(curSeconds) || isNaN(durMinutes) || isNaN(durSeconds))
            trackTime.removeClass('active');
        else
            trackTime.addClass('active');
        seekBar.width(playProgress + '%');
        if (playProgress == 100) {
            i.attr('class', 'fa fa-play');
            seekBar.width(0);
            tProgress.text('00:00');
            albumArt.removeClass('buffering').removeClass('active');
            clearInterval(buffInterval);
        }
    }
    function checkBuffering() {
        clearInterval(buffInterval);
        buffInterval = setInterval(function() {
            if ((nTime == 0) || (bTime - nTime) > 1000)
                albumArt.addClass('buffering');
            else
                albumArt.removeClass('buffering');
            bTime = new Date();
            bTime = bTime.getTime();
        }, 100);
    }
    function selectTrack(flag) {
        if (flag == 0 || flag == 1)
            ++currIndex;
        else
            --currIndex;
        if ((currIndex > -1) && (currIndex < albumArtworks.length)) {
            if (flag == 0)
                i.attr('class', 'fa fa-play');
            else {
                albumArt.removeClass('buffering');
                i.attr('class', 'fa fa-pause');
            }
            seekBar.width(0);
            trackTime.removeClass('active');
            tProgress.text('00:00');
            tTime.text('00:00');
            currAlbum = albums[currIndex];
            currTrackName = trackNames[currIndex];
            currArtwork = albumArtworks[currIndex];
            audio.src = trackUrl[currIndex];
            nTime = 0;
            bTime = new Date();
            bTime = bTime.getTime();
            if (flag != 0) {
                audio.play();
                playerTrack.addClass('active');
                albumArt.addClass('active');
                clearInterval(buffInterval);
                checkBuffering();
            }
            albumName.text(currAlbum);
            trackName.text(currTrackName);
            albumArt.find('img.active').removeClass('active');
            $('#' + currArtwork).addClass('active');
            bgArtworkUrl = $('#' + currArtwork).attr('src');
            bgArtwork.css({
                'background-image': 'url(' + bgArtworkUrl + ')'
            });
        } else {
            if (flag == 0 || flag == 1)
                --currIndex;
            else
                ++currIndex;
        }
    }
    function initPlayer() {
        audio = new Audio();
        selectTrack(0);
        audio.loop = false;
        playPauseButton.on('click', playPause);
        sArea.mousemove(function(event) {
            showHover(event);
        });
        sArea.mouseout(hideHover);
        sArea.on('click', playFromClickedPos);
        $(audio).on('timeupdate', updateCurrTime);
        playPreviousTrackButton.on('click', function() {
            selectTrack(-1);
        });
        playNextTrackButton.on('click', function() {
            selectTrack(1);
        });
    }
    initPlayer();
});
