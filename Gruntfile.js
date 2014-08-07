module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
    	pkg: grunt.file.readJSON('package.json'),
    	concat: {
	      options: {
	        separator: ';'
	      },
	      dist: {
	        src: ['www/js/build/**/*.js'],
	        dest: 'www/js/<%= pkg.name %>.js'
	      }
	    },
  		sass: {                              // Task
		    dist: {                            // Target
		        options: {                       // Target options
		          	style: 'compressed',
		          	compass:true,
		          	//require: 'animation',
		        },
				files: {                         // Dictionary of files
				  'www/css/web.css': 'www/scss/web.scss',       // 'destination': 'source'
				}
		    }
		},
		jshint: {
		    all: ['Gruntfile.js', 'www/js/**/*.js', 'www/js/<%= pkg.name %>.js']
		},
  		uglify: {
	        options: {
	          	beautify: false,
	          	mangle: false
	        },
	        my_target: {
	          	files: {
	          	  'www/js/<%= pkg.name %>.min.js': ['www/js/<%= pkg.name %>.js']
	          	}
	        }
	    },
	    watch: {
	  	    scripts: {
		  	    files: ['www/js/build/**/*.js'],
		  	    tasks: ['concat', 'uglify'],
		  	    options: {
	  	       		interrupt: true,
		  	    }
	  	    },
	  	    sass: {
	  	        files: ['www/scss/**/*.scss'],
	  	        tasks: ['sass'],
  	        }
  		}
  	});

  	grunt.loadNpmTasks('grunt-contrib-watch');
  	grunt.loadNpmTasks('grunt-contrib-uglify');
  	grunt.loadNpmTasks('grunt-contrib-sass');
  	grunt.loadNpmTasks('grunt-contrib-concat');
  	//grunt.loadNpmTasks('grunt-contrib-jshint');

  	grunt.registerTask('default', ['watch']);	
}  	