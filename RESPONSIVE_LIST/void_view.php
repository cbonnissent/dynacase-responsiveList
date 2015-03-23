<?php
/**
 * Created by PhpStorm.
 * User: charles
 * Date: 23/03/15
 * Time: 18:37
 */

namespace rsp;

class void_view extends \Dcp\Ui\DefaultView
{
    public function getTemplates(\Doc $doc = null)
    {
        $tpl = parent::getTemplates($doc);

        $tpl["body"] = array(
            'file' => "RESPONSIVE_LIST/Layout/void.mustache"
        );
        return $tpl;
    }
}