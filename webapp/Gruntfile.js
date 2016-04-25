/**
 * Created by dcoellar on 4/25/16.
 */

module.exports = function(grunt) {
    //grunt wrapper function
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        //grunt task configuration will go here

        concat: {
            js: { //target
                src: ['./publicDev/app/**/*.js'],
                dest: './distTemp/ez-app.js'
            }
        },

        uglify: {
            js: { //target
                src: ['./distTemp/ez-app.js'],
                dest: './public/ez-app-min.js'
            }
        },

        copy: {
            main: {
                files: [
                    // includes files within path
                    {expand: true, cwd: 'publicDev/', src: ['app/**/*.html'], dest: 'public' },
                    {expand: true, cwd: 'publicDev/', src: ['assets/css/vendor/**'], dest: 'public' },
                    {expand: true, cwd: 'publicDev/', src: ['assets/js/vendor/**'], dest: 'public' },
                    {expand: true, cwd: 'publicDev/', src: ['assets/apk/**'], dest: 'public' },
                    {expand: true, cwd: 'publicDev/', src: ['assets/images/*.*'], dest: 'public' },
                    {expand: true, cwd: 'publicDev/assets/', src: ['images/*.*'], dest: 'public' },
                    {expand: true, cwd: 'publicDev/modules/', src: 'data.js', dest: 'public' },
                    {expand: true, cwd: 'publicDev/modules/', src: 'realTime.js', dest: 'public' },
                    {expand: true, cwd: 'publicDev/assets/css/', src: 'app.css', dest: 'public' }
                ]
            }
        },

        dev_prod_switch: {
            options: {
                environment: grunt.option('env') || 'dev',
                env_char: '#',
                env_block_dev: 'env:dev',
                env_block_prod: 'env:prod'
            },
            dynamic_mappings: {
                files: [{
                    expand: true,
                    cwd: './publicDev/',
                    src: ['index.html'],
                    dest: './public'
                }]
            }
        },

        cacheBust: {
            taskName: {
                options: {
                    baseDir: './public/',
                    deleteOriginals: true,
                    assets: ['*.js','*.css']
                },
                src: ['public/index.html']
            }
        }
    });

    //load grunt tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-cache-bust');
    grunt.loadNpmTasks('grunt-dev-prod-switch');
    //grunt.loadNpmTasks('grunt-ng-annotate');

    //register grunt default task
    //grunt.registerTask('default', ['ngAnnotate', 'concat', 'uglify']);
    grunt.registerTask('default', ['concat', 'uglify', 'copy', 'dev_prod_switch', 'cacheBust']);
}