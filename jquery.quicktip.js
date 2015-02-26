;(function($, window, document, undefined) {
    var pluginName = 'tooltip', debug = false;
    
    var internal = { 
        reposition: function(event) { 
            var mousex = event.pageX, mousey = event.pageY;
            
            $(this).data(pluginName)['tooltip'].css({top: mousey + 'px', left: mousex + 'px'});
        },
        
        show: function(event) {
            if (debug) console.log(pluginName + '.show()');
            var $this  = $(this), data = $this.data(pluginName);
   
            data['tooltip'].stop(true, true).fadeIn(600);
            $this.on('mousemove.' + pluginName, internal.reposition); 
        },
      
        hide: function(event) {
            if (debug) console.log(pluginName + '.hide()');
            var $this = $(this), data  = $this.data(pluginName);
            
            $this.off('mousemove.' + pluginName, internal.reposition);
            data['tooltip'].stop(true, true).fadeOut(400);
        }
    }; 
    
    var external = { 
        init: function(options) {   
            if (debug) console.log(pluginName + '.init()'); 
            
            options = $.extend(
                true,                                  
                {},                                    
                $.fn[pluginName].defaults,              
                typeof options == 'object' &&  options 
           ); 
            
            return this.each(function() {
                
                var $this = $(this), data = $this.data(pluginName);
                if (data) return; 
                
                var title    = $this.attr('title');
                if (!title) return;                

                var $tooltip = $('<div />', { 
                        class: options.class,
                        text:  title
                    }).appendTo('body').hide();

                var data = {
                    tooltip:   $tooltip,
                    options:   options,
                    title:     title
                };

                $this
                    .data(pluginName, data)
                    .attr('title', '')
                    .on('mouseenter.' + pluginName, internal.show)
                    .on('mouseleave.' + pluginName, internal.hide);                
            });
        },
        
        update: function(content) { 
            if (debug) console.log(pluginName + '.update(content)', content);
            
            return this.each(function() {
                var $this = $(this), // One link
                    data  = $this.data(pluginName); 
                if (!data) return; // Nothing here
                
                data['tooltip'].html(content);
            });
        },
        
        destroy: function() { 
            if (debug) console.log(pluginName + '.destroy()');
            
            return this.each(function() {
                var $this = $(this),
                    data  = $this.data(pluginName);
                if (!data) return; 
                
                $this
                    .attr('title', data['title'])
                    .off('.' + pluginName)     
                    .removeData(pluginName); 
                
                data['tooltip'].remove(); 
            });
        }
    }; 

    $.fn[pluginName] = function(method) {
        if (external[method]) return external[method].apply(this, Array.prototype.slice.call(arguments, 1));
        else if ($.type(method) === 'object' || !method) return external.init.apply(this, arguments);
        else $.error('Method ' + method + ' does not exist on jQuery.' + pluginName + '.js');
    };

    $.fn[pluginName].defaults = {    
        class:  pluginName + 'Element'
    };
    
})(window.jQuery);