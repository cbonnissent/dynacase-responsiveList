<?php

namespace rsp;

use \Dcp\AttributeIdentifiers\VOID as MyAttributes;

Class VOID extends \Dcp\Family\Document implements \Dcp\Ui\IRenderConfigAccess
{


    public function getRenderConfig($mode)
    {
        return new void_view($this);
    }

    public function getCustomTitle() {
        return "Chargement...";
    }

}