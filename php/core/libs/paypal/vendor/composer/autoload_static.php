<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit96c9ac4bbcc08de4bd8aca7ca55d64bf
{
    public static $prefixLengthsPsr4 = array (
        'B' => 
        array (
            'Braintree\\' => 10,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Braintree\\' => 
        array (
            0 => __DIR__ . '/..' . '/braintree/braintree_php/lib/Braintree',
        ),
    );

    public static $prefixesPsr0 = array (
        'B' => 
        array (
            'Braintree' => 
            array (
                0 => __DIR__ . '/..' . '/braintree/braintree_php/lib',
            ),
        ),
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit96c9ac4bbcc08de4bd8aca7ca55d64bf::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit96c9ac4bbcc08de4bd8aca7ca55d64bf::$prefixDirsPsr4;
            $loader->prefixesPsr0 = ComposerStaticInit96c9ac4bbcc08de4bd8aca7ca55d64bf::$prefixesPsr0;

        }, null, ClassLoader::class);
    }
}
