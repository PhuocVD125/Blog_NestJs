import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    private readonly logger = new Logger(RolesGuard.name);

    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        // Lấy các roles yêu cầu từ metadata của handler và class (nếu có)
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        this.logger.debug(`Required roles: ${requiredRoles}`);

        // Nếu không có roles yêu cầu, cho phép truy cập
        if (!requiredRoles) {
            return true;
        }

        // Lấy request từ context
        const request = context.switchToHttp().getRequest();
        const user = request.user; // Đọc thông tin user từ request object
        this.logger.debug(`User from request: ${JSON.stringify(user)}`);

        // Kiểm tra nếu user hoặc role của user không tồn tại
        if (!user || !user.role) {
            this.logger.warn('User or user.role is undefined');
            return false;
        }

        // Kiểm tra nếu user có role yêu cầu
        const hasRole = requiredRoles.includes(user.role);
        this.logger.debug(`User has required role: ${hasRole}`);

        return hasRole;
    }
}
