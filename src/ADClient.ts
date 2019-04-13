import ADResponse from './ADResponse';
import ADRequest from './ADRequest';

export default interface Client {
    fetch<T>(request: Readonly<ADRequest>): Promise<ADResponse<T>>
}