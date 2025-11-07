class ApplicationController < ActionController::API
  # Для API мы сами определяем current_user по заголовку
  private

  def current_user
    return @current_user if defined?(@current_user)

    user_id = request.headers['X-User-Id']
    @current_user = user_id.present? ? User.find_by(id: user_id) : nil
  end

  def authenticate_user!
    render json: { error: 'Not Authorized' }, status: :unauthorized unless current_user
  end

  def require_admin!
    render json: { error: 'Forbidden' }, status: :forbidden unless current_user&.role == 'admin'
  end
end
