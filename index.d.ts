export = DynamoDBStorage;
declare class DynamoDBStorage {
    /**
     * Constructs DynamoDB migration storage.
     *
     * @param {object} [options]
     * @param {string} [options.tableName=''] - Name of the DynamoDB. Defaults to a empty string and will throw an error
     * if no table name is provided.
     * @param {string} [options.keyName='migrationName'] - The hash key name of the table.
     * @param {DynamoDBClientConfig} [options.dynamoDBConfig={}] - DynamoDB configuration.
     *
     * @throws Error
     */
    constructor({ tableName, keyName, dynamoDBConfig }?: {
        tableName: string;
        keyName: string;
        dynamoDBConfig: DynamoDBClientConfig;
    });
    dynamoClient: DynamoDBClient;
    tableName: string;
    keyName: string;
    /**
     * Logs migration to be considered as executed
     *
     * @param migrationName - Name of the migration to be logged.
     * @returns {Promise}
     */
    logMigration(migrationName: any): Promise<any>;
    /**
     * Unlogs migration to be considered as pending.
     *
     * @param migrationName - Name of the migration to be logged.
     * @returns {Promise}
     */
    unlogMigration(migrationName: any): Promise<any>;
    /**
     * Get list of executed migrations.
     *
     * @returns {Promise.<String[]>}
     */
    executed(): Promise<string[]>;
}
import { DynamoDBClient } from "@aws-sdk/client-dynamodb/dist/types/DynamoDBClient";
import { DynamoDBClientConfig } from "@aws-sdk/client-dynamodb/dist/types/DynamoDBClient";
