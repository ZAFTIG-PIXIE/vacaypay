module.exports = function(grunt) {

    grunt.initConfig({

      jshint: {
        files: {
          src: [
            'server/**/*.js',
            'client/app/**/*.js'
          ]
        }
      },

      concat: {
        client: {
          src: [
            'client/app/app.js',
            'client/app/auth/auth.js',
            'client/app/fallback/fallback.js',
            'client/app/createTrip/createTrip.js',
            'client/app/currentTrip/currentTrip.js',
            'client/app/expense/expense.js',
            'client/app/createExpense/createExpense.js',
            'client/app/pastTrip/pastTrip.js',
            'client/app/route-config.js',
            'client/app/services/authFactory.js',
            'client/app/services/expenseFactory.js',
            'client/app/services/tripFactory.js',
            'client/app/services/pastTripFactory.js',
            'client/app/services/addFriendFactory.js',
            'client/app/services/MessageFactory.js'
          ],
          dest: 'client/dist/client.js'
        },
        dependencies: {
          src: [
            'client/lib/jquery/dist/jquery.min.js',
            'client/lib/bootstrap/dist/js/bootstrap.min.js',
            'client/lib/angular/angular.js',
            'client/lib/angular-ui-router/release/angular-ui-router.min.js',
            'client/lib/angular-bootstrap/ui-bootstrap.min.js',
            'client/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
            'client/lib/lodash/dist/lodash.min.js',
            'client/lib/ng-maps/dist/ng-maps.min.js',
            'client/lib/ng-timeago/ngtimeago.js',
            'client/lib/angularjs-dropdown-multiselect/dist/angularjs-dropdown-multiselect.min.js'
          ],
          dest: 'client/dist/dependencies.min.js'
        }
      },

      uglify: {
        client: {
          src: [
            'client/dist/client.js'
          ],
          dest: 'client/dist/client.min.js'
        }
      },

      cssmin: {
        target: {
          src: [
            'client/styles/styles.css'
          ],
          dest: 'client/dist/styles.min.css'
        }
      },

      nodemon: {
        dev: {
          script: 'server/app.js'
        }
      }
    });

    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    
    grunt.registerTask('build', [
      'concat',
      'uglify',
      'cssmin'
    ]);

    grunt.registerTask('heroku', [
      'build'
    ]);

    grunt.registerTask('default', [
      'build',
      'nodemon'
    ]);
};
