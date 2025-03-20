import { Controller } from '@nestjs/common';
import { SecurityService } from './security.service';

@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}
}
