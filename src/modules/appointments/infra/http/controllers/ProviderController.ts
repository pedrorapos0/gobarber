import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';

class ProviderController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const listProvidersService = container.resolve(ListProvidersService);
    const providers = await listProvidersService.execute({
      user_id: id,
    });

    return response.json(providers);
  }
}

export default ProviderController;
