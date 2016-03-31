<?php
/**
 * Created by PhpStorm.
 * User: charles
 * Date: 04/03/15
 * Time: 15:07
 */

namespace RESPONSIVE_LIST;

use Dcp\HttpApi\V1\Crud\DocumentUtils;
use Dcp\HttpApi\V1\Crud\Exception;
use Dcp\HttpApi\V1\Crud\DocumentCollection;
use Dcp\HttpApi\V1\DocManager\DocManager;

class ListDocument extends DocumentCollection
{

    /**
     * @var \Doc
     */
    protected $_collection = null;

    /**
     * Create new ressource
     *
     * @return mixed
     * @throws Exception
     */
    public function create()
    {
        $exception = new Exception("CRUD0103", __METHOD__);
        $exception->setHttpStatus(
            "405", "You cannot create"
        );
        throw $exception;
    }

    /**
     * Read a ressource
     *
     * @param string|int $resourceId Resource identifier
     *
     * @return mixed
     */
    public function read($resourceId)
    {
        $return = parent::read($resourceId);
        $searchDoc = new \SearchDoc("");
        $searchDoc->useCollection($this->_collection->getPropertyValue("id"));
        if (isset($this->contentParameters["keyword"])
            && !empty($this->contentParameters["keyword"])
        ) {
            $searchDoc->addGeneralFilter(
                "*" . $this->contentParameters["keyword"] . "*",
                true
            );
        }
        $return["resultMax"] = $searchDoc->onlyCount();
        $return["uri"] = $this->generateURL(
            sprintf(
                "listDocument/%s",
                $this->_collection->getPropertyValue("id")
            )
        );
        unset($return["properties"]);
        return $return;
    }

    /**
     * Update the ressource
     *
     * @param string|int $resourceId Resource identifier
     *
     * @return mixed
     * @throws Exception
     */
    public function update($resourceId)
    {
        $exception = new Exception("CRUD0103", __METHOD__);
        $exception->setHttpStatus(
            "405", "You cannot update"
        );
        throw $exception;
    }

    /**
     * Delete ressource
     *
     * @param string|int $resourceId Resource identifier
     *
     * @return mixed
     * @throws Exception
     */
    public function delete($resourceId)
    {
        $exception = new Exception("CRUD0103", __METHOD__);
        $exception->setHttpStatus(
            "405", "You cannot delete"
        );
        throw $exception;
    }

    /**
     * Set the family of the current request
     *
     * @param array $array
     *
     * @throws Exception
     */
    public function setUrlParameters(Array $array)
    {
        parent::setUrlParameters($array);
        $collectionId = isset($this->urlParameters["collectionId"])
            ? $this->urlParameters["collectionId"] : false;
        $this->_collection = DocManager::getDocument($collectionId);
        if (!$this->_collection) {
            $exception = new Exception("CRUD0200", $collectionId);
            $exception->setHttpStatus("404", "Collection not found");
            throw $exception;
        }
    }

    protected function prepareSearchDoc()
    {
        $this->_searchDoc = new \SearchDoc("");
        $this->_searchDoc->useCollection(
            $this->_collection->getPropertyValue("id")
        );
        
        $this->_searchDoc->setObjectReturn();
        if (isset($this->contentParameters["keyword"])
            && !empty($this->contentParameters["keyword"])
        ) {
            $this->_searchDoc->addGeneralFilter(
                "*" . $this->contentParameters["keyword"] . "*",
                true
            );
        }
    }

    /**
     * Extract orderBy
     *
     * @return string
     * @throws Exception
     */
    protected function extractOrderBy()
    {
        $orderBy = isset($this->contentParameters["orderBy"]) ? $this->contentParameters["orderBy"] : false;
        if ($orderBy === false && $this->_collection) {
            $orderBy = $this->_collection->getRawValue("rep_idsort", false) ? $this->_collection->getRawValue("rep_idsort", false) : $this->_collection->getRawValue("rep_sort", false);
            if ($orderBy) {
                $orderBy .= $this->_collection->getRawValue("rep_ordersort", false) ? " ".$this->_collection->getRawValue("rep_ordersort", false): "";
            }
        }
        if ($orderBy === false) {
            $orderBy = "title asc";
        }
        return $orderBy;
        //return DocumentUtils::extractOrderBy($orderBy);
    }

    protected function getAttributeFields()
    {
        $prefix = self::GET_ATTRIBUTE;
        $fields = $this->getFields();
        if ($this->hasFields(self::GET_ATTRIBUTES)
            || $this->hasFields(
                self::GET_ATTRIBUTE
            )
        ) {
            $tmpDoc = new_Doc(
                "", $this->_collection->getAttributeValue("se_famid")
            );
            return DocumentUtils::getAttributesFields(
                $tmpDoc, $prefix, $fields
            );
        }
        return array();
    }

}