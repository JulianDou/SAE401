<?php
// filepath: /workspaces/SAE401/backend/src/Doctrine/TableNameGenerator.php
namespace App\Doctrine;

use Doctrine\ORM\Mapping\NamingStrategy;

class TableNameGenerator implements NamingStrategy
{
    private string $prefix;

    public function __construct(string $prefix = 'cyclec_')
    {
        $this->prefix = $prefix;
    }

    public function classToTableName($className): string
    {
        // Récupère uniquement le nom de la classe sans le namespace
        $className = substr(strrchr($className, '\\'), 1);
    
        // Convertit le nom de la classe en snake_case
        $tableName = strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $className));
    
        // Ajoute le préfixe
        return $this->prefix . $tableName;
    }

    public function propertyToColumnName($propertyName, $className = null): string
    {
        return strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $propertyName));
    }

    public function embeddedFieldToColumnName($propertyName, $embeddedColumnName, $className = null, $embeddedClassName = null): string
    {
        return $this->propertyToColumnName($propertyName) . '_' . $embeddedColumnName;
    }

    public function referenceColumnName(): string
    {
        return 'id';
    }

    public function joinColumnName($propertyName, $className = null): string
    {
        return $this->propertyToColumnName($propertyName) . '_id';
    }

    public function joinTableName($sourceEntity, $targetEntity, $propertyName = null): string
    {
        $sourceTable = $this->classToTableName($sourceEntity);
        $targetTable = $this->classToTableName($targetEntity);
    
        return $sourceTable . '_' . $targetTable;
    }

    public function joinKeyColumnName($entityName, $referencedColumnName = null): string
    {
        return $this->classToTableName($entityName) . '_' . ($referencedColumnName ?: $this->referenceColumnName());
    }
}