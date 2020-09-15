import { Handler } from 'aws-lambda';

import { errorHandler } from '@helper/error-handler';
import { log } from '@helper/logger';
import { MediaInfoCurlService, Track } from '@services/media-info-curl.service';
import { APIGatewayLambdaEvent } from '@interfaces/api-gateway-lambda.interface';
import { MediaInfoUrl } from './media-info.inteface';
import { MediaInfoManager } from './media-info.manager';

/**
 * It's required if you use any external executable files like mediainfo-curl
 */
if (process.env.LAMBDA_TASK_ROOT) {
  process.env.PATH = `${process.env.PATH};${process.env.LAMBDA_TASK_ROOT}/bin`;
}

/**
 * This is a handler file
 * It should contain Lambda functions for one feature
 * For example, Media Info feature
 * Or CRUD operations for the user entity
 */

/**
 * This is a Lambda function
 * It implements some functionality of the feature
 *
 * It should only create a feature manager object and call the manager's method
 * All required data should be provided to the manager's method
 * Do not provide event or context objects
 * You should create interfaces for required data
 * All required services except feature service should be provided to the manager's method
 *
 * This function should handle all errors and return them with proper structure
 * @param event - APIGateway, SQS Trigger, SNS Trigger, etc. event object
 * @param context
 */
type MediaInfoEvent = APIGatewayLambdaEvent<MediaInfoUrl>;

type MediaInfoResult = Track | undefined;

type MediaInfoHandler = Handler<MediaInfoEvent, MediaInfoResult>;

export const getMediaInfo: MediaInfoHandler = async (event, context) => {
  log(event);

  try {
    /**
     * Create the manager object
     */
    const manager = new MediaInfoManager();

    /**
     * Prepare required data
     */
    const mediaInfoUrl: MediaInfoUrl = event.body;

    /**
     * Prepare required services
     */
    const mediaInfoCurlService = new MediaInfoCurlService();

    /**
     * Call the manager's method
     */
    return await manager.getMediaInfo(mediaInfoUrl, mediaInfoCurlService);
  } catch (e) {
    /**
     * Handle all errors
     */
    errorHandler(e);
  }
};
