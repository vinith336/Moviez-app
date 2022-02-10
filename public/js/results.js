$(document).ready(function () {
    AOS.init()
    const products = $('.search-results').toArray()
    $('.search-container').hide()
    $('.spinner-wrapper').fadeOut(500)
    
    //Change navbar color on scroll i.e make it opaque
    $(window).scroll(function () {
        var scroll = $(window).scrollTop()
        if (scroll == 0) {
            $('.navbar-dark').css({ 'background-color': 'rgba(153, 102, 51, 0.7)'})
        } else {
            $('.navbar-dark').css({ 'background-color': '#996633'})
        }
    })

    $(window).keypress(function (e) {
        const code = e.keyCode || e.which
        if (code == 13) {
            e.preventDefault()
        }
    })

    //Search animation and displaying results
    $('#searchterm').keyup(function () {
        const query = $('#searchterm').val().trim().toLowerCase()
        if(query == '') {
            return $('.search-container').slideUp()
        }
        var searchterms = products
        searchterms = searchterms.filter((searchterm) => searchterm.innerHTML.includes(query))
        var html = ''
        if (searchterms.length === 0)
        {
            html = '<p class="text-white" style="font-size: 1.5em;">No such product found !</p>'
        }
        searchterms.forEach((searchterm) => {
            html += `<div class="row search-row"><div class="col-12"><p class="search-results">${searchterm.innerHTML}</p></div></div>`
        })
        $('.search-container').html(html)    
        $('.search-container').slideDown('slow')
        //Send the search result to server
        $('.search-results').click(function () {
            console.log('here')
            const value= $(this).html()
            $('#searchterm').val(value)
            $('#searchform').submit()
        })
    })
})